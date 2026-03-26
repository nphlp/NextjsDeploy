import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loginUser, registerUser, requestPasswordReset, resetPassword, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-reset-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const NEW_PASSWORD = "NewStrongP@ss99!";

describe("Reset password — integration", () => {
    beforeAll(async () => {
        await deleteAllEmails();

        // Register and verify
        await registerUser(TEST_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        await deleteAllEmails();
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("request reset sends email with link", async () => {
        const { response } = await requestPasswordReset(TEST_EMAIL);
        expect(response.status).toBe(200);

        const email = await getLatestEmail(TEST_EMAIL);
        expect(email.Subject).toContain("Réinitialisez");
    });

    it("reset with valid token and strong password succeeds", async () => {
        await deleteAllEmails();
        await requestPasswordReset(TEST_EMAIL);

        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+reset-password[^\s"<]*/);
        const url = new URL(link.replace(/&amp;/g, "&"));

        // Token may be in path (/reset-password/:token) or query (?token=xxx)
        const pathSegments = url.pathname.split("/");
        const token = url.searchParams.get("token") ?? pathSegments[pathSegments.length - 1];

        const { response } = await resetPassword(token, NEW_PASSWORD);
        expect(response.status).toBe(200);
    });

    it("login with new password works after reset", async () => {
        const { response } = await loginUser(TEST_EMAIL, NEW_PASSWORD);
        expect(response.status).toBe(200);
    });

    it("login with old password fails after reset", async () => {
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(response.status).not.toBe(200);
    });

    it("reset with weak password returns error", async () => {
        await deleteAllEmails();
        await requestPasswordReset(TEST_EMAIL);

        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+reset-password[^\s"<]*/);
        const url = new URL(link.replace(/&amp;/g, "&"));
        const pathSegments = url.pathname.split("/");
        const token = url.searchParams.get("token") ?? pathSegments[pathSegments.length - 1];

        const { response } = await resetPassword(token, "weak");
        expect(response.status).toBe(400);
    });
});
