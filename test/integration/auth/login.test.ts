import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-login-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";

describe("Login — integration", () => {
    beforeAll(async () => {
        await deleteAllEmails();

        // Register and verify a user
        await registerUser(TEST_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        const token = new URL(link).searchParams.get("token")!;
        await verifyEmail(token);
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("login with valid credentials returns a session", async () => {
        const { response, data } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(response.status).toBe(200);
        expect(data).not.toBeNull();
        // Better Auth may return session/token in different formats
        expect(data?.user?.email ?? data?.email).toBe(TEST_EMAIL);
    });

    it("login with valid credentials returns a session cookie", async () => {
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        const cookie = extractSessionCookie(response);
        expect(cookie).toContain("better-auth.session_token=");
    });

    it("login with wrong password returns error", async () => {
        const { response } = await loginUser(TEST_EMAIL, "WrongP@ssword14!");
        expect(response.status).not.toBe(200);
    });

    it("login with non-existing email returns error", async () => {
        const { response } = await loginUser(`nonexistent-${timestamp}@gmail.com`, TEST_PASSWORD);
        expect(response.status).not.toBe(200);
    });
});
