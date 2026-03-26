import SendContactAction from "@actions/SendContactAction";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("@lib/env", () => ({
    IS_DEV: false,
    SMTP_FROM: "hello@test.com",
    SMTP_FROM_NAME: "Test App",
    SUPPORT_EMAIL: "support@test.com",
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
}));

// Mock Nodemailer
const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test" });
vi.mock("@lib/nodemailer", () => ({
    default: { sendMail: (...args: unknown[]) => mockSendMail(...args) },
}));

// Mock SendEmailAction (for confirmation email)
const mockSendEmailAction = vi.fn();
vi.mock("@actions/SendEmailAction", () => ({
    default: (...args: unknown[]) => mockSendEmailAction(...args),
}));

// Mock email templates
vi.mock("@/components/email-contact", () => ({
    default: () => "contact-template",
}));
vi.mock("@comps/email-template", () => ({
    default: (props: { emailType: string }) => props.emailType,
}));

// Mock @react-email/render
vi.mock("@react-email/render", () => ({
    render: async () => "<html>rendered</html>",
}));

describe("SendContactAction", () => {
    beforeEach(() => {
        mockSendMail.mockClear();
        mockSendEmailAction.mockClear();
    });

    it("sends email to SUPPORT_EMAIL", async () => {
        await SendContactAction({
            subject: "Bug report",
            message: "Something broke",
            senderEmail: "user@example.com",
        });

        expect(mockSendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: "support@test.com",
            }),
        );
    });

    it("sets replyTo to sender email", async () => {
        await SendContactAction({
            subject: "Question",
            message: "Hello",
            senderEmail: "sender@example.com",
        });

        expect(mockSendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                replyTo: "sender@example.com",
            }),
        );
    });

    it("prefixes subject with [Contact]", async () => {
        await SendContactAction({
            subject: "Signaler un bug",
            message: "Details",
            senderEmail: "user@example.com",
        });

        expect(mockSendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "[Contact] Signaler un bug",
            }),
        );
    });

    it("uses SMTP_FROM with SMTP_FROM_NAME as sender", async () => {
        await SendContactAction({
            subject: "Test",
            message: "Hello",
            senderEmail: "user@example.com",
        });

        expect(mockSendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                from: '"Test App" <hello@test.com>',
            }),
        );
    });

    it("sends confirmation email to sender (fire-and-forget)", async () => {
        await SendContactAction({
            subject: "Test",
            message: "Hello",
            senderEmail: "user@example.com",
        });

        expect(mockSendEmailAction).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Votre message a bien été envoyé",
                email: "user@example.com",
            }),
        );
    });

    it("throws on send failure", async () => {
        mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

        await expect(
            SendContactAction({
                subject: "Test",
                message: "Hello",
                senderEmail: "user@example.com",
            }),
        ).rejects.toThrow("Unable to send contact email");
    });
});
