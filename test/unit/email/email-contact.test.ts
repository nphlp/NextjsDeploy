import { render } from "@react-email/render";
import { describe, expect, it, vi } from "vitest";
import ContactEmailTemplate from "@/components/email-contact";

// Mock env
vi.mock("@lib/env", () => ({
    SMTP_FROM_NAME: "Test App",
}));

describe("ContactEmailTemplate", () => {
    it("renders valid HTML", async () => {
        const html = await render(
            ContactEmailTemplate({
                subject: "Bug report",
                message: "Something is broken",
                senderEmail: "user@test.com",
            }),
        );

        expect(html).toContain("<!DOCTYPE html");
        expect(html).toContain("Test App");
    });

    it("renders subject in email body", async () => {
        const html = await render(
            ContactEmailTemplate({
                subject: "Problème de sécurité",
                message: "J'ai un souci",
                senderEmail: "user@test.com",
            }),
        );

        expect(html).toContain("Problème de sécurité");
    });

    it("renders sender email in email body", async () => {
        const html = await render(
            ContactEmailTemplate({
                subject: "Test",
                message: "Hello",
                senderEmail: "contact@example.com",
            }),
        );

        expect(html).toContain("contact@example.com");
    });

    it("renders message content in email body", async () => {
        const html = await render(
            ContactEmailTemplate({
                subject: "Test",
                message: "This is my detailed message about an issue",
                senderEmail: "user@test.com",
            }),
        );

        expect(html).toContain("This is my detailed message about an issue");
    });

    it("uses SMTP_FROM_NAME (not hardcoded)", async () => {
        const html = await render(
            ContactEmailTemplate({
                subject: "Test",
                message: "Hello",
                senderEmail: "user@test.com",
            }),
        );

        expect(html).toContain("Test App");
    });
});
