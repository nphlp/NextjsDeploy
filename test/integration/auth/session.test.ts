import { auth } from "@lib/auth";
import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-session-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

describe("Session management — integration", () => {
    let sessionCookie: string;

    beforeAll(async () => {
        await deleteAllEmails();

        // Register, verify, login
        await registerUser(TEST_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        sessionCookie = extractSessionCookie(response);
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("getSession returns current session with user data", async () => {
        const request = new Request(`${BASE_URL}/api/auth/get-session`, {
            headers: { Cookie: sessionCookie },
        });
        const response = await auth.handler(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data?.user?.email).toBe(TEST_EMAIL);
        expect(data?.user?.lastname).toBeDefined();
        expect(data?.user?.role).toBeDefined();
    });

    it("getSession without cookie returns null", async () => {
        const request = new Request(`${BASE_URL}/api/auth/get-session`);
        const response = await auth.handler(request);
        const data = await response.json();

        expect(data?.session ?? null).toBeNull();
    });

    it("extended session includes lastname, role, pendingEmail", async () => {
        const request = new Request(`${BASE_URL}/api/auth/get-session`, {
            headers: { Cookie: sessionCookie },
        });
        const response = await auth.handler(request);
        const data = await response.json();

        expect(data?.user).toHaveProperty("lastname");
        expect(data?.user).toHaveProperty("role");
        expect(data?.user).toHaveProperty("pendingEmail");
    });

    it("listSessions returns at least one session", async () => {
        const request = new Request(`${BASE_URL}/api/auth/list-sessions`, {
            method: "GET",
            headers: { Cookie: sessionCookie },
        });
        const response = await auth.handler(request);
        const data = await response.json();

        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThanOrEqual(1);
    });
});
