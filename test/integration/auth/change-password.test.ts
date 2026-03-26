import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { changePassword, extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-chgpwd-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const NEW_PASSWORD = "NewStrongP@ss99!";

describe("Change password — integration", () => {
    let sessionCookie: string;

    beforeAll(async () => {
        await deleteAllEmails();

        // Register, verify, and login
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

    it("changes password with correct current password", async () => {
        const { response } = await changePassword(TEST_PASSWORD, NEW_PASSWORD, sessionCookie);
        expect(response.status).toBe(200);
    });

    it("login with new password works", async () => {
        const { response } = await loginUser(TEST_EMAIL, NEW_PASSWORD);
        expect(response.status).toBe(200);
    });

    it("login with old password fails", async () => {
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(response.status).not.toBe(200);
    });

    it("rejects weak new password", async () => {
        const { response: loginRes } = await loginUser(TEST_EMAIL, NEW_PASSWORD);
        const cookie = extractSessionCookie(loginRes);

        const { response } = await changePassword(NEW_PASSWORD, "weak", cookie);
        expect(response.status).toBe(400);
    });

    it("rejects wrong current password", async () => {
        const { response: loginRes } = await loginUser(TEST_EMAIL, NEW_PASSWORD);
        const cookie = extractSessionCookie(loginRes);

        const { response } = await changePassword("WrongP@ss99!", "AnotherStr0ng!!", cookie);
        expect(response.status).not.toBe(200);
    });
});
