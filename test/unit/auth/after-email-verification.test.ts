import { afterEmailVerification } from "@lib/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("@lib/env", () => ({
    BETTER_AUTH_SECRET: "test-secret",
    IS_DEV: false,
    IS_TEST: true,
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    TURNSTILE_SECRET_KEY: "test",
}));

// Mock jose
const mockJwtPayload = vi.fn();
vi.mock("jose", () => ({
    jwtVerify: async () => ({ payload: mockJwtPayload() }),
}));

// Mock Prisma
const mockUpdate = vi.fn();
vi.mock("@lib/prisma", () => ({
    default: {
        $extends: () => ({}),
        user: { update: (...args: unknown[]) => mockUpdate(...args) },
    },
}));

// Mock SendEmailAction
const mockSendEmail = vi.fn();
vi.mock("@actions/send-email", () => ({
    default: (...args: unknown[]) => mockSendEmail(...args),
}));

// Mock EmailTemplate
vi.mock("@comps/email-template", () => ({
    default: (props: { emailType: string }) => props.emailType,
}));

// Mock better-auth/api (for APIError)
vi.mock("better-auth/api", () => {
    class APIError extends Error {
        constructor(
            public status: string,
            public options: { message: string },
        ) {
            super(options.message);
        }
    }
    return { APIError, createAuthMiddleware: (fn: unknown) => fn };
});

describe("afterEmailVerification", () => {
    beforeEach(() => {
        mockJwtPayload.mockReset();
        mockUpdate.mockReset();
        mockSendEmail.mockReset();
        mockUpdate.mockResolvedValue({});
    });

    it("clears pendingEmail on change-email verification", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "user-1" },
            data: { pendingEmail: null },
        });
    });

    it("sends notification to old email (change-completed)", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "old@test.com",
                body: "change-completed",
            }),
        );
    });

    it("sends notification to new email (change-success)", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "new@test.com",
                body: "change-success",
            }),
        );
    });

    it("sends both notification emails (old + new)", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockSendEmail).toHaveBeenCalledTimes(2);
    });

    it("does nothing for regular email verification (no updateTo)", async () => {
        mockJwtPayload.mockReturnValue({ email: "user@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("does nothing when request is undefined", async () => {
        await afterEmailVerification({ id: "user-1" } as never, undefined);

        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("does nothing when no token in URL", async () => {
        const request = new Request("http://localhost:3000/api/auth/verify-email");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("uses contact support URL for old email notification", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: expect.stringContaining("modifiée"),
            }),
        );
    });

    it("uses profile URL for new email notification", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await afterEmailVerification({ id: "user-1" } as never, request);

        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: expect.stringContaining("confirmé"),
            }),
        );
    });
});
