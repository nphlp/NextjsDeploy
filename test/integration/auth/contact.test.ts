import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { deleteAllEmails, getLatestEmail } from "../helpers/mailpit";

const timestamp = Date.now();
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@nansp.dev";
const SENDER_EMAIL = `test-contact-integration-${timestamp}@gmail.com`;

describe("Contact form — integration", () => {
    beforeAll(async () => {
        await deleteAllEmails();
    });

    afterAll(async () => {
        await deleteAllEmails();
    });

    it("sends contact email to SUPPORT_EMAIL via Mailpit", async () => {
        // Import server action directly
        const { default: SendContactAction } = await import("@actions/send-contact");

        await SendContactAction({
            subject: "Signaler un bug",
            message: "Test integration message",
            senderEmail: SENDER_EMAIL,
        });

        const email = await getLatestEmail(SUPPORT_EMAIL);
        expect(email.Subject).toContain("[Contact]");
        expect(email.Subject).toContain("Signaler un bug");
    });

    it("sends confirmation email to sender via Mailpit", async () => {
        // The confirmation is fire-and-forget — give extra time
        // Search by subject to avoid picking up the contact email
        const { getLatestEmailBySubject } = await import("../../e2e/helpers/mailpit");
        const email = await getLatestEmailBySubject(SENDER_EMAIL, "envoyé", 30, 500);
        expect(email.Subject).toContain("bien été envoyé");
    });
});
