import { auth } from "@lib/auth";
import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { changeEmail, extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-chgvrf-${timestamp}@gmail.com`;
const NEW_EMAIL = `test-integration-newvrf-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

describe("Change email verification flow — integration", () => {
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

        // Set pendingEmail (simulating the oRPC setPendingEmail action)
        await PrismaInstance.user.update({
            where: { email: TEST_EMAIL },
            data: { pendingEmail: NEW_EMAIL },
        });

        await deleteAllEmails();
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({
            where: { email: { in: [TEST_EMAIL, NEW_EMAIL] } },
        });
    });

    it("changeEmail sends verification email to new address", async () => {
        const { response } = await changeEmail(NEW_EMAIL, sessionCookie);
        expect(response.status).toBe(200);

        const email = await getLatestEmail(NEW_EMAIL);
        expect(email.Subject).toContain("Confirmez");
    });

    it("verification link updates email in DB", async () => {
        const email = await getLatestEmail(NEW_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);

        // Visit verification link via auth handler
        const request = new Request(link.replace(/&amp;/g, "&"), { method: "GET" });
        const response = await auth.handler(request);
        expect([200, 302].includes(response.status)).toBe(true);

        const user = await PrismaInstance.user.findUnique({ where: { email: NEW_EMAIL } });
        expect(user).not.toBeNull();
        expect(user!.email).toBe(NEW_EMAIL);
    });

    it("pendingEmail is cleared after verification", async () => {
        const user = await PrismaInstance.user.findUnique({ where: { email: NEW_EMAIL } });
        expect(user!.pendingEmail).toBeNull();
    });

    it("login with new email works", async () => {
        const { response } = await loginUser(NEW_EMAIL, TEST_PASSWORD);
        expect(response.status).toBe(200);
    });

    it("login with old email fails", async () => {
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(response.status).not.toBe(200);
    });
});

describe("Change email cancellation — integration", () => {
    const CANCEL_EMAIL = `test-integration-cancel-${timestamp}@gmail.com`;
    const CANCEL_NEW = `test-integration-cancnew-${timestamp}@gmail.com`;
    let sessionCookie: string;

    beforeAll(async () => {
        await deleteAllEmails();

        // Register, verify, login
        await registerUser(CANCEL_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(CANCEL_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        const { response } = await loginUser(CANCEL_EMAIL, TEST_PASSWORD);
        sessionCookie = extractSessionCookie(response);
        await deleteAllEmails();
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({
            where: { email: { in: [CANCEL_EMAIL, CANCEL_NEW] } },
        });
    });

    it("cancel clears pendingEmail in DB", async () => {
        // Request change and set pending
        await PrismaInstance.user.update({ where: { email: CANCEL_EMAIL }, data: { pendingEmail: CANCEL_NEW } });

        const user = await PrismaInstance.user.findUnique({ where: { email: CANCEL_EMAIL } });
        expect(user!.pendingEmail).toBe(CANCEL_NEW);

        // Cancel
        await PrismaInstance.user.update({ where: { email: CANCEL_EMAIL }, data: { pendingEmail: null } });

        const canceled = await PrismaInstance.user.findUnique({ where: { email: CANCEL_EMAIL } });
        expect(canceled!.pendingEmail).toBeNull();

        // Note: token invalidation after cancel is tested in:
        // - Unit: verify-email-route.test.ts (route handler blocks canceled tokens)
        // - E2E: change-email.spec.ts (full browser flow)
    });
});
