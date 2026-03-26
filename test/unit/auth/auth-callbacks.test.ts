import { sendMagicLink, sendResetPassword, sendVerificationEmail } from "@lib/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock SendEmailAction
const mockSendEmail = vi.fn();
vi.mock("@actions/SendEmailAction", () => ({
    default: (...args: unknown[]) => mockSendEmail(...args),
}));

// Mock EmailTemplate (return emailType for assertion)
vi.mock("@comps/email-template", () => ({
    default: (props: { buttonUrl: string; emailType: string }) => `${props.emailType}:${props.buttonUrl}`,
}));

// Mock env
vi.mock("@lib/env", () => ({
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: "test-secret",
    IS_DEV: false,
    IS_TEST: true,
    TURNSTILE_SECRET_KEY: "test-key",
}));

// Mock Prisma (with $extends for Better Auth workaround in auth.ts)
const mockFindUnique = vi.fn();
vi.mock("@lib/prisma", () => ({
    default: {
        $extends: () => ({
            user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) },
        }),
        user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) },
    },
}));

describe("sendVerificationEmail", () => {
    beforeEach(() => mockSendEmail.mockReset());

    it("calls SendEmailAction with correct subject", async () => {
        await sendVerificationEmail(
            { user: { email: "user@test.com" } as never, url: "https://example.com/verify?token=abc", token: "abc" },
            undefined,
        );

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Vérifiez votre adresse email",
                email: "user@test.com",
            }),
        );
    });

    it("uses emailType 'verification'", async () => {
        await sendVerificationEmail(
            { user: { email: "user@test.com" } as never, url: "https://example.com/verify", token: "abc" },
            undefined,
        );

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.stringContaining("verification"),
            }),
        );
    });

    it("passes the verification URL to the template", async () => {
        await sendVerificationEmail(
            { user: { email: "user@test.com" } as never, url: "https://example.com/verify?token=xyz", token: "xyz" },
            undefined,
        );

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.stringContaining("https://example.com/verify?token=xyz"),
            }),
        );
    });
});

describe("sendResetPassword", () => {
    beforeEach(() => mockSendEmail.mockReset());

    it("calls SendEmailAction with correct subject", async () => {
        await sendResetPassword(
            { user: { email: "user@test.com" } as never, url: "https://example.com/reset?token=abc", token: "abc" },
            undefined,
        );

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Réinitialisez votre mot de passe",
                email: "user@test.com",
            }),
        );
    });

    it("uses emailType 'reset'", async () => {
        await sendResetPassword(
            { user: { email: "user@test.com" } as never, url: "https://example.com/reset", token: "abc" },
            undefined,
        );

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.stringContaining("reset"),
            }),
        );
    });
});

describe("sendMagicLink", () => {
    beforeEach(() => {
        mockSendEmail.mockReset();
        mockFindUnique.mockReset();
    });

    it("sends magic-link email when user exists", async () => {
        mockFindUnique.mockResolvedValue({ id: "1", email: "user@test.com" });

        await sendMagicLink({ email: "user@test.com", url: "https://example.com/magic", token: "abc" });

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Votre lien de connexion",
                email: "user@test.com",
                body: expect.stringContaining("magic-link"),
            }),
        );
    });

    it("sends magic-link-no-account email when user does NOT exist (anti-enum)", async () => {
        mockFindUnique.mockResolvedValue(null);

        await sendMagicLink({ email: "unknown@test.com", url: "https://example.com/magic", token: "abc" });

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Créez votre compte",
                email: "unknown@test.com",
                body: expect.stringContaining("magic-link-no-account"),
            }),
        );
    });

    it("uses /register URL for non-existing user (not the magic link URL)", async () => {
        mockFindUnique.mockResolvedValue(null);

        await sendMagicLink({ email: "unknown@test.com", url: "https://example.com/magic", token: "abc" });

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.stringContaining("http://localhost:3000/register"),
            }),
        );
    });

    it("uses the provided URL for existing user", async () => {
        mockFindUnique.mockResolvedValue({ id: "1", email: "user@test.com" });

        await sendMagicLink({ email: "user@test.com", url: "https://example.com/magic?token=xyz", token: "xyz" });

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                body: expect.stringContaining("https://example.com/magic?token=xyz"),
            }),
        );
    });
});
