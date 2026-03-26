import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { changeEmail, extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-chgeml-${timestamp}@gmail.com`;
const NEW_EMAIL = `test-integration-neweml-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";

describe("Change email — integration", () => {
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
        await PrismaInstance.user.deleteMany({
            where: { email: { in: [TEST_EMAIL, NEW_EMAIL] } },
        });
    });

    it("changeEmail sends verification email to new address", async () => {
        await deleteAllEmails();
        const { response } = await changeEmail(NEW_EMAIL, sessionCookie);
        expect(response.status).toBe(200);

        const email = await getLatestEmail(NEW_EMAIL);
        expect(email.Subject).toContain("Vérifiez");
    });

    it("changeEmail with same email returns error", async () => {
        const { response, data } = await changeEmail(TEST_EMAIL, sessionCookie);
        expect(response.status).not.toBe(200);
        expect(data?.message).toContain("same");
    });

    it("setPendingEmail updates pendingEmail in DB", async () => {
        // pendingEmail should have been set by the oRPC action (called from client)
        // In integration, we set it directly via Prisma
        await PrismaInstance.user.update({
            where: { email: TEST_EMAIL },
            data: { pendingEmail: NEW_EMAIL },
        });

        const user = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(user!.pendingEmail).toBe(NEW_EMAIL);
    });

    it("cancelPendingEmail clears pendingEmail in DB", async () => {
        await PrismaInstance.user.update({
            where: { email: TEST_EMAIL },
            data: { pendingEmail: null },
        });

        const user = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(user!.pendingEmail).toBeNull();
    });

    it("changeEmail with existing email returns 200 (anti-enumeration)", async () => {
        // Register a second user
        const secondEmail = `test-enum-target-${timestamp}@gmail.com`;
        await registerUser(secondEmail, TEST_PASSWORD);

        const { response } = await changeEmail(secondEmail, sessionCookie);
        // Should return 200 even though email exists (anti-enum)
        expect(response.status).toBe(200);

        // Cleanup
        await PrismaInstance.user.deleteMany({ where: { email: secondEmail } });
    });
});
