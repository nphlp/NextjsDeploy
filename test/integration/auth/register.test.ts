import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { registerUser } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-register-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";

describe("Register — integration", () => {
    beforeAll(async () => {
        await deleteAllEmails();
    });

    afterAll(async () => {
        // Cleanup test user
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("creates user in DB with emailVerified: false", async () => {
        const { response } = await registerUser(TEST_EMAIL, TEST_PASSWORD);
        expect(response.status).toBe(200);

        const user = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(user).not.toBeNull();
        expect(user!.emailVerified).toBe(false);
        expect(user!.name).toBe("Test");
        expect(user!.lastname).toBe("User");
    });

    it("sends verification email to Mailpit", async () => {
        const email = await getLatestEmail(TEST_EMAIL);
        expect(email.Subject).toContain("Vérifiez");
    });

    it("verification email contains a valid link", async () => {
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        expect(link).toContain("/api/auth/verify-email");
        expect(link).toContain("token=");
    });

    it("register with disposable domain returns EMAIL_INVALID", async () => {
        const { response, data } = await registerUser(`user@mailinator.com`, TEST_PASSWORD);
        expect(response.status).toBe(400);
        expect(data?.message).toBe("EMAIL_INVALID");
    });

    it("register with weak password returns PASSWORD_INVALID", async () => {
        const { response, data } = await registerUser(`weak-pass-${timestamp}@gmail.com`, "weak");
        expect(response.status).toBe(400);
        expect(data?.message).toMatch(/PASSWORD_INVALID|PASSWORD_MISSING/);
    });

    it("register with existing email returns 200 (anti-enumeration)", async () => {
        const { response } = await registerUser(TEST_EMAIL, TEST_PASSWORD);
        // Should NOT return 400 "already exists" — anti-enum protection
        expect(response.status).toBe(200);
    });

    it("register existing email returns same JSON key order as real user (anti-enum)", async () => {
        // First register a new user
        const newEmail = `test-enum-${timestamp}@gmail.com`;
        const { data: realData } = await registerUser(newEmail, TEST_PASSWORD);
        const realKeys = Object.keys(realData?.user ?? {});

        // Then try registering with the same email (synthetic user)
        const { data: fakeData } = await registerUser(newEmail, TEST_PASSWORD);
        const fakeKeys = Object.keys(fakeData?.user ?? {});

        expect(fakeKeys).toEqual(realKeys);

        // Cleanup
        await PrismaInstance.user.deleteMany({ where: { email: newEmail } });
    });
});
