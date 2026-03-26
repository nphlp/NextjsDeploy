import { authBeforeMiddleware } from "@lib/auth-middleware";
import { describe, expect, it, vi } from "vitest";

// Mock better-auth/api
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

// Mock fetch (for API calls) — return non-disposable by default
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ disposable: false }) }));

// Mock DNS — return valid MX records by default
vi.mock("node:dns/promises", async (importOriginal) => {
    const mod = await importOriginal<typeof import("node:dns/promises")>();
    return { ...mod, resolveMx: vi.fn().mockResolvedValue([{ exchange: "mx.example.com", priority: 10 }]) };
});

// Helper to create a fake middleware context
function createCtx(overrides: { path: string; body?: Record<string, unknown> }) {
    return overrides as Parameters<typeof authBeforeMiddleware>[0];
}

// ─── Email domain validation (local lists) ──────────────────────────────

describe("Auth middleware — email domain validation (local lists)", () => {
    it("accepts trusted domain: gmail.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "StrongP@ssword14!" } }),
            ),
        ).resolves.not.toThrow();
    });

    it("accepts trusted domain: outlook.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@outlook.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).resolves.not.toThrow();
    });

    it("accepts trusted domain: proton.me", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@proton.me", password: "StrongP@ssword14!" } }),
            ),
        ).resolves.not.toThrow();
    });

    it("accepts trusted domain: icloud.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@icloud.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).resolves.not.toThrow();
    });

    it("accepts trusted domain: free.fr", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@free.fr", password: "StrongP@ssword14!" } }),
            ),
        ).resolves.not.toThrow();
    });

    it("rejects disposable domain: mailinator.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@mailinator.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).rejects.toThrow("EMAIL_INVALID");
    });

    it("rejects disposable domain: yopmail.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@yopmail.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).rejects.toThrow("EMAIL_INVALID");
    });

    it("rejects disposable domain: guerrillamail.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@guerrillamail.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).rejects.toThrow("EMAIL_INVALID");
    });

    it("rejects disposable domain: tempmail.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@tempmail.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).rejects.toThrow("EMAIL_INVALID");
    });

    it("rejects disposable domain: 10minutemail.com", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@10minutemail.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).rejects.toThrow("EMAIL_INVALID");
    });
});

// ─── Email validation per path ──────────────────────────────────────────

describe("Auth middleware — email validation per path", () => {
    it("validates email domain on /sign-up/email (body.email)", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/sign-up/email",
                    body: { email: "user@yopmail.com", password: "StrongP@ssword14!" },
                }),
            ),
        ).rejects.toThrow("EMAIL_INVALID");
    });

    it("validates email domain on /change-email (body.newEmail)", async () => {
        await expect(
            authBeforeMiddleware(createCtx({ path: "/change-email", body: { newEmail: "user@mailinator.com" } })),
        ).rejects.toThrow("EMAIL_INVALID");
    });

    it("does NOT validate email on /sign-in/email", async () => {
        await expect(
            authBeforeMiddleware(createCtx({ path: "/sign-in/email", body: { email: "user@mailinator.com" } })),
        ).resolves.not.toThrow();
    });

    it("does NOT validate email on /reset-password", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({
                    path: "/reset-password",
                    body: { email: "user@mailinator.com", newPassword: "StrongP@ssword14!" },
                }),
            ),
        ).resolves.not.toThrow();
    });
});

// ─── Password validation ────────────────────────────────────────────────

describe("Auth middleware — password validation", () => {
    it("rejects missing password on /sign-up/email", async () => {
        await expect(
            authBeforeMiddleware(createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com" } })),
        ).rejects.toThrow("PASSWORD_MISSING");
    });

    it("rejects empty password", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "" } }),
            ),
        ).rejects.toThrow("PASSWORD_MISSING");
    });

    it("rejects password too short (< 14 chars)", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "Short1!aB" } }),
            ),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("rejects password without uppercase", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "nouppercase1234!" } }),
            ),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("rejects password without lowercase", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "NOLOWERCASE1234!" } }),
            ),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("rejects password without number", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "NoNumberHereAb!!" } }),
            ),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("rejects password without special character", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "NoSpecialChar1234" } }),
            ),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("accepts strong password (14+ chars, upper, lower, number, special)", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "StrongP@ssword14!" } }),
            ),
        ).resolves.not.toThrow();
    });

    it("accepts password at exactly 14 characters", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "Abcdefgh1234!!" } }),
            ),
        ).resolves.not.toThrow();
    });
});

// ─── Password validation per path ───────────────────────────────────────

describe("Auth middleware — password validation per path", () => {
    it("validates body.password on /sign-up/email", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/sign-up/email", body: { email: "user@gmail.com", password: "weak" } }),
            ),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("validates body.newPassword on /change-password", async () => {
        await expect(
            authBeforeMiddleware(createCtx({ path: "/change-password", body: { newPassword: "weak" } })),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("validates body.newPassword on /reset-password", async () => {
        await expect(
            authBeforeMiddleware(createCtx({ path: "/reset-password", body: { newPassword: "weak" } })),
        ).rejects.toThrow("PASSWORD_INVALID");
    });

    it("does NOT validate password on /sign-in/email", async () => {
        await expect(
            authBeforeMiddleware(createCtx({ path: "/sign-in/email", body: { password: "weak" } })),
        ).resolves.not.toThrow();
    });

    it("does NOT validate password on /change-email", async () => {
        await expect(
            authBeforeMiddleware(
                createCtx({ path: "/change-email", body: { newEmail: "user@gmail.com", password: "weak" } }),
            ),
        ).resolves.not.toThrow();
    });
});
