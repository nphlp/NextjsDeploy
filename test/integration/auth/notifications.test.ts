import PrismaInstance from "@lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extractSessionCookie, loginUser, registerUser, verifyEmail } from "../helpers/auth-api";
import { deleteAllEmails, extractLinkFromEmail, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const TEST_EMAIL = `test-integration-notif-${timestamp}@gmail.com`;
const TEST_PASSWORD = "StrongP@ssword14!";

/** Search for an email by subject substring (with retries for fire-and-forget) */
async function findEmailBySubject(to: string, subjectContains: string, retries = 30, delay = 500) {
    const MAILPIT_API = "http://localhost:8025/api/v1";
    for (let i = 0; i < retries; i++) {
        const res = await fetch(`${MAILPIT_API}/search?query=to:${encodeURIComponent(to)}&limit=10`);
        const data = await res.json();
        const match = data.messages?.find((m: { Subject: string }) => m.Subject.includes(subjectContains));
        if (match) {
            const detail = await fetch(`${MAILPIT_API}/message/${match.ID}`);
            return detail.json();
        }
        await new Promise((r) => setTimeout(r, delay));
    }
    return null;
}

describe("Security notification emails — integration", () => {
    let sessionCookie: string;

    beforeAll(async () => {
        await deleteAllEmails();

        await registerUser(TEST_EMAIL, TEST_PASSWORD);
        const email = await getLatestEmail(TEST_EMAIL);
        const link = extractLinkFromEmail(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await verifyEmail(new URL(link).searchParams.get("token")!);
        const { response } = await loginUser(TEST_EMAIL, TEST_PASSWORD);
        sessionCookie = extractSessionCookie(response);
        await deleteAllEmails();
    });

    afterAll(async () => {
        await PrismaInstance.user.deleteMany({ where: { email: TEST_EMAIL } });
    });

    it("changePassword notification email arrives in Mailpit", async () => {
        await deleteAllEmails();

        const { default: SendEmailAction } = await import("@actions/send-email");
        const { default: EmailTemplate } = await import("@comps/email-template");

        await SendEmailAction({
            subject: "Votre mot de passe a été modifié",
            email: TEST_EMAIL,
            body: EmailTemplate({
                buttonUrl: "http://localhost:3000/contact?subject=security",
                emailType: "password-changed",
            }),
        });

        const email = await findEmailBySubject(TEST_EMAIL, "mot de passe");
        expect(email).not.toBeNull();
        expect(email.Subject).toContain("mot de passe");
    });

    it("TOTP enable notification email arrives in Mailpit", async () => {
        await deleteAllEmails();

        const { default: SendEmailAction } = await import("@actions/send-email");
        const { default: EmailTemplate } = await import("@comps/email-template");

        await SendEmailAction({
            subject: "Authentification à deux facteurs activée",
            email: TEST_EMAIL,
            body: EmailTemplate({
                buttonUrl: "http://localhost:3000/contact?subject=security",
                emailType: "totp-enabled",
            }),
        });

        const email = await findEmailBySubject(TEST_EMAIL, "deux facteurs");
        expect(email).not.toBeNull();
    });

    it("TOTP disable notification email arrives in Mailpit", async () => {
        await deleteAllEmails();

        const { default: SendEmailAction } = await import("@actions/send-email");
        const { default: EmailTemplate } = await import("@comps/email-template");

        await SendEmailAction({
            subject: "Authentification à deux facteurs désactivée",
            email: TEST_EMAIL,
            body: EmailTemplate({
                buttonUrl: "http://localhost:3000/contact?subject=security",
                emailType: "totp-disabled",
            }),
        });

        const email = await findEmailBySubject(TEST_EMAIL, "désactivée");
        expect(email).not.toBeNull();
    });

    it("change-completed notification email arrives in Mailpit", async () => {
        await deleteAllEmails();

        const { default: SendEmailAction } = await import("@actions/send-email");
        const { default: EmailTemplate } = await import("@comps/email-template");

        await SendEmailAction({
            subject: "Votre adresse email a été modifiée",
            email: TEST_EMAIL,
            body: EmailTemplate({
                buttonUrl: "http://localhost:3000/contact?subject=security",
                emailType: "change-completed",
            }),
        });

        const email = await findEmailBySubject(TEST_EMAIL, "modifiée");
        expect(email).not.toBeNull();
    });

    it("change-canceled notification email arrives in Mailpit", async () => {
        await deleteAllEmails();

        const { default: SendEmailAction } = await import("@actions/send-email");
        const { default: EmailTemplate } = await import("@comps/email-template");

        await SendEmailAction({
            subject: "Changement d\u2019email annulé",
            email: TEST_EMAIL,
            body: EmailTemplate({
                buttonUrl: "http://localhost:3000/contact?subject=security",
                emailType: "change-canceled",
            }),
        });

        const email = await findEmailBySubject(TEST_EMAIL, "annulé");
        expect(email).not.toBeNull();
    });
});
