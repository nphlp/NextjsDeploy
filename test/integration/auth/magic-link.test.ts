import { auth } from "@lib/auth";
import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-magic-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

describe("Magic link — integration", () => {
    beforeAll(async () => {
        await deleteAllEmails();

        // Register and verify user
        await registerUser(TEST_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        await deleteAllEmails();
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("sends magic link email for existing user", async () => {
        const request = new Request(`${BASE_URL}/api/auth/sign-in/magic-link`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: TEST_EMAIL }),
        });
        const response = await auth.handler(request);
        expect(response.status).toBe(200);

        const email = await getLatestEmail(TEST_EMAIL);
        expect(email.Subject).toContain("connexion");
    });

    it("sends register email for non-existing user (anti-enum)", async () => {
        await deleteAllEmails();
        const unknownEmail = `unknown-magic-${timestamp}@gmail.com`;

        const request = new Request(`${BASE_URL}/api/auth/sign-in/magic-link`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: unknownEmail }),
        });
        const response = await auth.handler(request);
        expect(response.status).toBe(200);

        const email = await getLatestEmail(unknownEmail);
        expect(email.Subject).toContain("Créez");
    });

    it("magic link email contains a valid verification link", async () => {
        await deleteAllEmails();

        const request = new Request(`${BASE_URL}/api/auth/sign-in/magic-link`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: TEST_EMAIL }),
        });
        await auth.handler(request);

        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+magic-link[^\s"<]*/);
        expect(link).toContain("token=");
    });
});
