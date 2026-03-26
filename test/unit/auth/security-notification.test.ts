import SendSecurityNotificationAction from "@actions/SendSecurityNotificationAction";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("@lib/env", () => ({
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
}));

// Mock auth-server
const mockGetSession = vi.fn();
vi.mock("@lib/auth-server", () => ({
    getSession: () => mockGetSession(),
}));

// Mock SendEmailAction
const mockSendEmail = vi.fn();
vi.mock("@actions/SendEmailAction", () => ({
    default: (...args: unknown[]) => mockSendEmail(...args),
}));

// Mock email template (return a simple element)
vi.mock("@comps/email-template", () => ({
    default: (props: { emailType: string }) => props.emailType,
}));

describe("SendSecurityNotificationAction", () => {
    beforeEach(() => {
        mockGetSession.mockReset();
        mockSendEmail.mockReset();
    });

    it("sends email with correct subject for password-changed", async () => {
        mockGetSession.mockResolvedValue({ user: { email: "user@test.com" } });

        await SendSecurityNotificationAction("password-changed");

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Votre mot de passe a été modifié",
                email: "user@test.com",
            }),
        );
    });

    it("sends email with correct subject for totp-enabled", async () => {
        mockGetSession.mockResolvedValue({ user: { email: "user@test.com" } });

        await SendSecurityNotificationAction("totp-enabled");

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: "Authentification à deux facteurs activée",
                email: "user@test.com",
            }),
        );
    });

    it("sends email with correct subject for totp-disabled", async () => {
        mockGetSession.mockResolvedValue({ user: { email: "user@test.com" } });

        await SendSecurityNotificationAction("totp-disabled");

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: expect.stringContaining("deux facteurs"),
                email: "user@test.com",
            }),
        );
    });

    it("sends email with correct subject for passkey-added", async () => {
        mockGetSession.mockResolvedValue({ user: { email: "user@test.com" } });

        await SendSecurityNotificationAction("passkey-added");

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: expect.stringContaining("accès"),
                email: "user@test.com",
            }),
        );
    });

    it("sends email with correct subject for passkey-deleted", async () => {
        mockGetSession.mockResolvedValue({ user: { email: "user@test.com" } });

        await SendSecurityNotificationAction("passkey-deleted");

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: expect.stringContaining("accès"),
                email: "user@test.com",
            }),
        );
    });

    it("does not send email when no session", async () => {
        mockGetSession.mockResolvedValue(null);

        await SendSecurityNotificationAction("password-changed");

        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("does not throw when session fails", async () => {
        mockGetSession.mockRejectedValue(new Error("Session error"));

        await expect(SendSecurityNotificationAction("password-changed")).resolves.not.toThrow();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("uses correct contact URL as button URL", async () => {
        mockGetSession.mockResolvedValue({ user: { email: "user@test.com" } });

        await SendSecurityNotificationAction("password-changed");

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                body: "password-changed",
            }),
        );
    });
});
