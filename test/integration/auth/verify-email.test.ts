import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-verify-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";

describe("Email verification — integration", () => {
    let verificationToken: string;

    beforeAll(async () => {
        await deleteAllEmails();
        await registerUser(TEST_EMAIL, TEST_PASSWORD);

        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        verificationToken = new URL(link).searchParams.get("token")!;
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("verification sets emailVerified to true", async () => {
        const beforeVerify = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(beforeVerify!.emailVerified).toBe(false);

        await verifyEmail(verificationToken);

        const afterVerify = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(afterVerify!.emailVerified).toBe(true);
    });

    it("reused token on already-verified email is idempotent", async () => {
        // Better Auth may accept the same token again (email already verified)
        const response = await verifyEmail(verificationToken);
        // Should not crash — either success (idempotent) or redirect
        expect([200, 302].includes(response.status)).toBe(true);
    });
});
