import { auth } from "@lib/auth";
import PrismaInstance from "@lib/prisma";
import * as OTPAuth from "otpauth";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-totp-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function generateCode(secret: string): string {
    const totp = new OTPAuth.TOTP({ algorithm: "SHA1", digits: 6, period: 30, secret });
    return totp.generate();
}

async function callWithSession(path: string, body: Record<string, unknown>, cookie: string) {
    const request = new Request(`${BASE_URL}/api/auth${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify(body),
    });
    return auth.handler(request);
}

describe("TOTP (2FA) — integration", () => {
    let sessionCookie: string;
    let totpSecret: string;
    let backupCodes: string[];

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
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("enable 2FA returns TOTP URI with secret", async () => {
        const response = await callWithSession("/two-factor/enable", { password: TEST_PASSWORD }, sessionCookie);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.totpURI).toContain("otpauth://");

        // Extract secret from URI
        const url = new URL(data.totpURI);
        totpSecret = url.searchParams.get("secret")!;
        expect(totpSecret).toBeTruthy();
    });

    it("verify TOTP with correct code activates 2FA and returns backup codes", async () => {
        const code = generateCode(totpSecret);

        const response = await callWithSession("/two-factor/verify-totp", { code }, sessionCookie);
        expect(response.status).toBe(200);

        const data = await response.json();
        // Backup codes may be in data.backupCodes or data.status
        backupCodes = data.backupCodes ?? [];

        // Check DB
        const user = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(user!.twoFactorEnabled).toBe(true);
    });

    it("verify TOTP with wrong code returns error", async () => {
        const response = await callWithSession("/two-factor/verify-totp", { code: "000000" }, sessionCookie);
        expect(response.status).not.toBe(200);
    });

    it("login with 2FA enabled returns 2FA pending", async () => {
        const { response, data } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(response.status).toBe(200);
        expect(data?.twoFactorRedirect).toBe(true);
    });

    it("full 2FA login flow → verify TOTP → get session → disable 2FA", async () => {
        // Step 1: login → get 2FA pending cookie
        const { response: loginRes } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        const twoFactorCookie =
            loginRes.headers
                .getSetCookie?.()
                .find((c) => c.includes("two_factor"))
                ?.split(";")[0] ?? "";
        expect(twoFactorCookie).toBeTruthy();

        // Step 2: verify TOTP with 2FA cookie → get session
        const code = generateCode(totpSecret);
        const verifyReq = new Request(`${BASE_URL}/api/auth/two-factor/verify-totp`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: twoFactorCookie },
            body: JSON.stringify({ code }),
        });
        const verifyRes = await auth.handler(verifyReq);
        expect(verifyRes.status).toBe(200);

        const newSessionCookie = extractSessionCookie(verifyRes);
        expect(newSessionCookie).toBeTruthy();

        // Step 3: disable 2FA with the new session
        const disableRes = await callWithSession("/two-factor/disable", { password: TEST_PASSWORD }, newSessionCookie);
        expect(disableRes.status).toBe(200);

        const user = await PrismaInstance.user.findUnique({ where: { email: TEST_EMAIL } });
        expect(user!.twoFactorEnabled).toBe(false);
    });

    it("login after disable skips 2FA", async () => {
        const { data } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        expect(data?.twoFactorRedirect).toBeFalsy();
    });
});
