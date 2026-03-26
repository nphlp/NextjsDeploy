import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-full-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";

describe("Register complete flow — integration (no browser)", () => {
    beforeAll(async () => {
        await deleteAllEmails();
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("register → verify email → login → session", async () => {
        // Step 1: Register
        const { response: regRes } = await registerUser(TEST_EMAIL, TEST_PASSWORD);
        expect(regRes.status).toBe(200);

        // Step 2: User created with emailVerified: false
        const unverified = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(unverified!.emailVerified).toBe(false);

        // Step 3: Verification email received
        const email = await getLatestEmail(TEST_EMAIL);
        expect(email.Subject).toContain("Vérifiez");

        // Step 4: Click verification link
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        const token = new URL(link).searchParams.get("token")!;
        await verifyEmail(token);

        // Step 5: Email verified
        const verified = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(verified!.emailVerified).toBe(true);

        // Step 6: Login
        const { response: loginRes } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(loginRes.status).toBe(200);

        // Step 7: Session cookie
        const cookie = extractSessionCookie(loginRes);
        expect(cookie).toContain("better-auth.session_token=");
    });
});
