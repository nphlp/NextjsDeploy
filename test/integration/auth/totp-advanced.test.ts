import { auth } from "@lib/auth";
import PrismaInstance from "@lib/prisma";
import * as OTPAuth from "otpauth";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-totp2-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function generateCode(secret: string): string {
    return new OTPAuth.TOTP({ algorithm: "SHA1", digits: 6, period: 30, secret }).generate();
}

async function callWithSession(path: string, body: Record<string, unknown>, cookie: string) {
    return auth.handler(
        new Request(`${BASE_URL}/api/auth${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: cookie },
            body: JSON.stringify(body),
        }),
    );
}

/** Full 2FA login: login → get 2FA cookie → verify TOTP → return session cookie */
async function login2FA(email: string, password: string, secret: string): Promise<string> {
    const { response: loginRes } = await loginUser(email, password);
    const twoFactorCookie =
        loginRes.headers
            .getSetCookie?.()
            .find((c) => c.includes("two_factor"))
            ?.split(";")[0] ?? "";

    const code = generateCode(secret);
    const verifyRes = await auth.handler(
        new Request(`${BASE_URL}/api/auth/two-factor/verify-totp`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: twoFactorCookie },
            body: JSON.stringify({ code }),
        }),
    );

    return extractSessionCookie(verifyRes);
}

describe("TOTP advanced — integration", () => {
    let sessionCookie: string;
    let totpSecret: string;

    beforeAll(async () => {
        await deleteAllEmails();

        // Register, verify, login
        await registerUser(TEST_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        sessionCookie = extractSessionCookie(response);

        // Enable 2FA
        const enableRes = await callWithSession("/two-factor/enable", { password: TEST_PASSWORD }, sessionCookie);
        const enableData = await enableRes.json();
        totpSecret = new URL(enableData.totpURI).searchParams.get("secret")!;

        // Verify TOTP to activate
        const code = generateCode(totpSecret);
        await callWithSession("/two-factor/verify-totp", { code }, sessionCookie);
    });

    afterAll(async () => {
        // Disable 2FA if still enabled, then cleanup
        try {
            const cookie = await login2FA(TEST_EMAIL, TEST_PASSWORD, totpSecret);
            await callWithSession("/two-factor/disable", { password: TEST_PASSWORD }, cookie);
        } catch {
            // Already disabled or cleanup
        }
        // Wait for background callbacks (onTotpEnabled/Disabled fire-and-forget)
        await new Promise((r) => setTimeout(r, 500));
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("TOTP verification creates a valid session", async () => {
        const cookie = await login2FA(TEST_EMAIL, TEST_PASSWORD, totpSecret);
        expect(cookie).toContain("better-auth.session_token=");

        // Verify session works
        const sessionRes = await auth.handler(
            new Request(`${BASE_URL}/api/auth/get-session`, { headers: { Cookie: cookie } }),
        );
        const data = await sessionRes.json();
        expect(data?.user?.email).toBe(TEST_EMAIL);
    });

    it("generateBackupCodes returns valid codes", async () => {
        const cookie = await login2FA(TEST_EMAIL, TEST_PASSWORD, totpSecret);
        const response = await callWithSession(
            "/two-factor/generate-backup-codes",
            { password: TEST_PASSWORD },
            cookie,
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.backupCodes).toBeDefined();
        expect(data.backupCodes.length).toBeGreaterThanOrEqual(6);
    });

    it("login with backup code creates session", async () => {
        const cookie = await login2FA(TEST_EMAIL, TEST_PASSWORD, totpSecret);
        const genRes = await callWithSession("/two-factor/generate-backup-codes", { password: TEST_PASSWORD }, cookie);
        const { backupCodes } = await genRes.json();

        // Login with backup code
        const { response: loginRes } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        const twoFactorCookie =
            loginRes.headers
                .getSetCookie?.()
                .find((c) => c.includes("two_factor"))
                ?.split(";")[0] ?? "";

        const backupRes = await auth.handler(
            new Request(`${BASE_URL}/api/auth/two-factor/verify-backup-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Cookie: twoFactorCookie },
                body: JSON.stringify({ code: backupCodes[0] }),
            }),
        );
        expect(backupRes.status).toBe(200);

        const backupSessionCookie = extractSessionCookie(backupRes);
        expect(backupSessionCookie).toContain("better-auth.session_token=");
    });

    it("used backup code cannot be reused", async () => {
        const cookie = await login2FA(TEST_EMAIL, TEST_PASSWORD, totpSecret);
        const genRes = await callWithSession("/two-factor/generate-backup-codes", { password: TEST_PASSWORD }, cookie);
        const { backupCodes } = await genRes.json();

        // Use first backup code
        const { response: loginRes1 } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        const tfCookie1 =
            loginRes1.headers
                .getSetCookie?.()
                .find((c) => c.includes("two_factor"))
                ?.split(";")[0] ?? "";
        await auth.handler(
            new Request(`${BASE_URL}/api/auth/two-factor/verify-backup-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Cookie: tfCookie1 },
                body: JSON.stringify({ code: backupCodes[0] }),
            }),
        );

        // Try to reuse the same backup code
        const { response: loginRes2 } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        const tfCookie2 =
            loginRes2.headers
                .getSetCookie?.()
                .find((c) => c.includes("two_factor"))
                ?.split(";")[0] ?? "";
        const reuse = await auth.handler(
            new Request(`${BASE_URL}/api/auth/two-factor/verify-backup-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Cookie: tfCookie2 },
                body: JSON.stringify({ code: backupCodes[0] }),
            }),
        );
        expect(reuse.status).not.toBe(200);
    });

    it("regenerated backup codes invalidate old codes", async () => {
        const cookie = await login2FA(TEST_EMAIL, TEST_PASSWORD, totpSecret);

        // Generate first set
        const gen1 = await callWithSession("/two-factor/generate-backup-codes", { password: TEST_PASSWORD }, cookie);
        const { backupCodes: oldCodes } = await gen1.json();

        // Generate second set (should invalidate old)
        const gen2 = await callWithSession("/two-factor/generate-backup-codes", { password: TEST_PASSWORD }, cookie);
        const { backupCodes: newCodes } = await gen2.json();
        expect(newCodes).not.toEqual(oldCodes);

        // Try to use an old code
        const { response: loginRes } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        const tfCookie =
            loginRes.headers
                .getSetCookie?.()
                .find((c) => c.includes("two_factor"))
                ?.split(";")[0] ?? "";
        const result = await auth.handler(
            new Request(`${BASE_URL}/api/auth/two-factor/verify-backup-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Cookie: tfCookie },
                body: JSON.stringify({ code: oldCodes[0] }),
            }),
        );
        expect(result.status).not.toBe(200);
    });
});
