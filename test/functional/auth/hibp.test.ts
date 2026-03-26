import PrismaInstance from "@lib/prisma";
import { createHash } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
    changePassword,
    extractSessionCookie,
    loginUser,
    registerUser,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
} from "../../integration/helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../../integration/helpers/mailpit";
import { hibpCompromised, server } from "../msw-server";

const timestamp = Date.now();
const SAFE_PASSWORD = "StrongP@ssword14!";
const COMPROMISED_PASSWORD = "CompromisedP@ss1!";

// Get the SHA1 suffix for the compromised password (HIBP uses k-anonymity)
const sha1Full = createHash("sha1").update(COMPROMISED_PASSWORD).digest("hex").toUpperCase();
const sha1Suffix = sha1Full.slice(5);

describe("Have I Been Pwned (HIBP) — functional", () => {
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

    it("register with compromised password returns PASSWORD_COMPROMISED", async () => {
        server.use(hibpCompromised(sha1Suffix));

        const email = `test-hibp-reg-${timestamp}@gmail.com`;
        const { response, data } = await registerUser(email, COMPROMISED_PASSWORD);

        expect(response.status).toBe(400);
        expect(data?.message).toBe("PASSWORD_COMPROMISED");

        // Cleanup just in case
        await PrismaInstance.user.deleteMany({ where: { email } });
    });

    it("reset-password with compromised password returns PASSWORD_COMPROMISED", async () => {
        // Setup: register and verify a user with a safe password
        const email = `test-hibp-reset-${timestamp}@gmail.com`;
        await registerUser(email, SAFE_PASSWORD);
        const verifyEmailMsg = await getLatestEmail(email);
        const link = extractLinkFromEmail(verifyEmailMsg, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);

        // Request reset
        await deleteAllEmails();
        await requestPasswordReset(email);
        const resetEmailMsg = await getLatestEmail(email);
        const resetLink = extractLinkFromEmail(resetEmailMsg, /http[s]?:\/\/[^\s"<]+reset-password[^\s"<]*/);
        const resetUrl = new URL(resetLink.replace(/&amp;/g, "&"));
        const pathSegments = resetUrl.pathname.split("/");
        const token = resetUrl.searchParams.get("token") ?? pathSegments[pathSegments.length - 1];

        // Try to reset with compromised password
        server.use(hibpCompromised(sha1Suffix));
        const { response, data } = await resetPassword(token, COMPROMISED_PASSWORD);

        expect(response.status).toBe(400);
        expect(data?.message).toBe("PASSWORD_COMPROMISED");

        // Cleanup
        await PrismaInstance.user.deleteMany({ where: { email } });
    });

    it("changePassword with compromised password returns PASSWORD_COMPROMISED", async () => {
        // Setup: register, verify, login
        const email = `test-hibp-chg-${timestamp}@gmail.com`;
        await registerUser(email, SAFE_PASSWORD);
        const verifyEmailMsg = await getLatestEmail(email);
        const link = extractLinkFromEmail(verifyEmailMsg, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        const { response: loginRes } = await loginUser(email, SAFE_PASSWORD);
        const cookie = extractSessionCookie(loginRes);

        // Try to change to a compromised password
        server.use(hibpCompromised(sha1Suffix));
        const { response, data } = await changePassword(SAFE_PASSWORD, COMPROMISED_PASSWORD, cookie);

        expect(response.status).toBe(400);
        expect(data?.message).toBe("PASSWORD_COMPROMISED");

        // Cleanup
        await PrismaInstance.user.deleteMany({ where: { email } });
    });
});
