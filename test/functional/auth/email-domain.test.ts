import PrismaInstance from "@lib/prisma";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { registerUser } from "../../integration/helpers/auth-api";
import { deleteAllEmails } from "../../integration/helpers/mailpit";
import { disifyDisposable, disifyDown, mailcheckDisposable, mailcheckDown, server } from "../msw-server";

const timestamp = Date.now();
const TEST_PASSWORD = "StrongP@ssword14!";

describe("Email domain validation with external APIs — functional", () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: "bypass" });
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(async () => {
        server.close();
        await deleteAllEmails();
    });

    it("rejects email flagged as disposable by Disify", async () => {
        server.use(disifyDisposable);

        const email = `test-disify-${timestamp}@unknown-domain.xyz`;
        const { response, data } = await registerUser(email, TEST_PASSWORD);

        expect(response.status).toBe(400);
        expect(data?.message).toBe("EMAIL_INVALID");
    });

    it("falls back to MailCheck when Disify is down", async () => {
        server.use(disifyDown, mailcheckDisposable);

        const email = `test-fallback-${timestamp}@unknown-domain.xyz`;
        const { response, data } = await registerUser(email, TEST_PASSWORD);

        expect(response.status).toBe(400);
        expect(data?.message).toBe("EMAIL_INVALID");
    });

    it("falls back to MX records when all APIs are down", async () => {
        server.use(disifyDown, mailcheckDown);

        // Use a domain that likely has no MX records
        const email = `test-mxfail-${timestamp}@thisdomain-does-not-exist-12345.xyz`;
        const { response, data } = await registerUser(email, TEST_PASSWORD);

        expect(response.status).toBe(400);
        expect(data?.message).toBe("EMAIL_INVALID");
    });

    it("accepts unknown domain when Disify says not disposable and MX exists", async () => {
        // Default handlers: Disify returns not disposable, MX check uses real DNS
        // Use a real domain that has MX records
        const email = `test-valid-${timestamp}@example.com`;
        const { response } = await registerUser(email, TEST_PASSWORD);

        // Should pass domain validation (example.com has MX records)
        expect(response.status).toBe(200);

        // Cleanup
        await PrismaInstance.user.deleteMany({ where: { email } });
    });

    it("rejects disposable domain on /change-email path too", async () => {
        server.use(disifyDisposable);

        // Register a valid user first
        const validEmail = `test-chgeml-${timestamp}@gmail.com`;
        await registerUser(validEmail, TEST_PASSWORD);

        // Try to change to a disposable domain
        const { auth } = await import("@lib/auth");
        const { extractSessionCookie, loginUser, verifyEmail } = await import("../../integration/helpers/auth-api");
        const { getLatestEmail, extractLinkFromEmail } = await import("../../integration/helpers/mailpit");

        // Verify and login
        server.resetHandlers(); // Reset to allow verification email
        const verifyEmailMsg = await getLatestEmail(validEmail);
        const link = extractLinkFromEmail(verifyEmailMsg, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        const { response: loginRes } = await loginUser(validEmail, TEST_PASSWORD);
        const cookie = extractSessionCookie(loginRes);

        // Now try change-email with disposable domain
        server.use(disifyDisposable);
        const changeReq = new Request("http://localhost:3000/api/auth/change-email", {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: cookie },
            body: JSON.stringify({ newEmail: `disposable-${timestamp}@unknown.xyz`, callbackURL: "/" }),
        });
        const changeRes = await auth.handler(changeReq);
        expect(changeRes.status).toBe(400);

        // Cleanup
        await PrismaInstance.user.deleteMany({ where: { email: validEmail } });
    });
});
