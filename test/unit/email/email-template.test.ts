import EmailTemplate from "@comps/email-template";
import { render } from "@react-email/render";
import { describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("@lib/env", () => ({
    SMTP_FROM_NAME: "Test App",
}));

const emailTypes = [
    "verification",
    "reset",
    "magic-link",
    "magic-link-no-account",
    "change-verification",
    "change-requested",
    "change-canceled",
    "change-completed",
    "change-success",
    "password-changed",
    "totp-enabled",
    "totp-disabled",
    "passkey-added",
    "passkey-deleted",
    "contact-confirmation",
] as const;

describe("EmailTemplate", () => {
    for (const emailType of emailTypes) {
        it(`renders valid HTML for type "${emailType}"`, async () => {
            const html = await render(EmailTemplate({ buttonUrl: "https://example.com", emailType }));

            expect(html).toContain("<!DOCTYPE html");
            expect(html).toContain("Test App");
            expect(html).toContain("https://example.com");
        });
    }

    it("uses SMTP_FROM_NAME in header (not hardcoded)", async () => {
        const html = await render(EmailTemplate({ buttonUrl: "https://example.com", emailType: "verification" }));

        expect(html).toContain("Test App");
        expect(html).not.toContain("Nextjs Deploy");
    });

    it("renders button with correct URL", async () => {
        const html = await render(
            EmailTemplate({ buttonUrl: "https://my-app.com/verify?token=abc", emailType: "verification" }),
        );

        expect(html).toContain("https://my-app.com/verify?token=abc");
    });

    it("renders contact support button for security types", async () => {
        const securityTypes = [
            "change-requested",
            "change-completed",
            "change-canceled",
            "password-changed",
            "totp-enabled",
            "totp-disabled",
            "passkey-added",
            "passkey-deleted",
        ] as const;

        for (const type of securityTypes) {
            const html = await render(EmailTemplate({ buttonUrl: "https://example.com/contact", emailType: type }));

            expect(html).toContain("Contacter le support");
        }
    });
});
