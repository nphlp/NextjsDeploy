import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("@lib/env", () => ({
    BETTER_AUTH_SECRET: "test-secret",
}));

// Mock jose — return controlled payload
const mockJwtPayload = vi.fn();
vi.mock("jose", () => ({
    jwtVerify: async () => ({ payload: mockJwtPayload() }),
}));

// Mock Prisma
const mockFindFirst = vi.fn();
vi.mock("@lib/prisma", () => ({
    default: {
        user: { findFirst: (...args: unknown[]) => mockFindFirst(...args) },
    },
}));

// Mock auth (Better Auth handler)
const mockDefaultGET = vi.fn().mockResolvedValue(new Response("OK", { status: 200 }));
vi.mock("@lib/auth", () => ({ auth: {} }));
vi.mock("better-auth/next-js", () => ({
    toNextJsHandler: () => ({ GET: mockDefaultGET, POST: vi.fn() }),
}));

// Import the route handler AFTER mocks
const { GET } = await import("@/app/api/auth/[...all]/route");

describe("GET /api/auth/verify-email — token invalidation", () => {
    beforeEach(() => {
        mockFindFirst.mockReset();
        mockDefaultGET.mockReset();
        mockDefaultGET.mockResolvedValue(new Response("OK", { status: 200 }));
        mockJwtPayload.mockReset();
    });

    it("blocks canceled change-email (pendingEmail is null)", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue({ id: "1", email: "old@test.com", pendingEmail: null });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid&callbackURL=/profile");
        const response = await GET(request as never);

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toContain("error=EMAIL_CHANGE_CANCELED");
        expect(mockDefaultGET).not.toHaveBeenCalled();
    });

    it("blocks change-email when pendingEmail does not match", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue({ id: "1", email: "old@test.com", pendingEmail: "other@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid&callbackURL=/profile");
        const response = await GET(request as never);

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toContain("error=EMAIL_CHANGE_CANCELED");
        expect(mockDefaultGET).not.toHaveBeenCalled();
    });

    it("blocks change-email when user not found", async () => {
        mockJwtPayload.mockReturnValue({ email: "unknown@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue(null);

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid&callbackURL=/profile");
        const response = await GET(request as never);

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toContain("error=EMAIL_CHANGE_CANCELED");
        expect(mockDefaultGET).not.toHaveBeenCalled();
    });

    it("allows change-email when pendingEmail matches", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue({ id: "1", email: "old@test.com", pendingEmail: "new@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid&callbackURL=/profile");
        await GET(request as never);

        expect(mockDefaultGET).toHaveBeenCalled();
    });

    it("passes through regular email verification (no updateTo)", async () => {
        mockJwtPayload.mockReturnValue({ email: "user@test.com" });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        await GET(request as never);

        expect(mockDefaultGET).toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("passes through non-verify-email paths", async () => {
        const request = new Request("http://localhost:3000/api/auth/get-session");
        await GET(request as never);

        expect(mockDefaultGET).toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("passes through when no token in URL", async () => {
        const request = new Request("http://localhost:3000/api/auth/verify-email");
        await GET(request as never);

        expect(mockDefaultGET).toHaveBeenCalled();
    });

    it("passes through when JWT verification throws (logs error)", async () => {
        mockJwtPayload.mockImplementation(() => {
            throw new Error("Invalid JWT");
        });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=bad-token");
        await GET(request as never);

        // Should fall through to Better Auth (not crash)
        expect(mockDefaultGET).toHaveBeenCalled();
    });

    it("uses & separator when callbackURL already has query params", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue({ id: "1", email: "old@test.com", pendingEmail: null });

        const request = new Request(
            "http://localhost:3000/api/auth/verify-email?token=valid&callbackURL=/profile?tab=security",
        );
        const response = await GET(request as never);

        const location = response.headers.get("location")!;
        expect(location).toContain("tab=security");
        expect(location).toContain("&error=EMAIL_CHANGE_CANCELED");
    });

    it("uses ? separator when callbackURL has no query params", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue({ id: "1", email: "old@test.com", pendingEmail: null });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid&callbackURL=/profile");
        const response = await GET(request as never);

        const location = response.headers.get("location")!;
        expect(location).toContain("/profile?error=EMAIL_CHANGE_CANCELED");
    });

    it("defaults callbackURL to / when not provided", async () => {
        mockJwtPayload.mockReturnValue({ email: "old@test.com", updateTo: "new@test.com" });
        mockFindFirst.mockResolvedValue({ id: "1", email: "old@test.com", pendingEmail: null });

        const request = new Request("http://localhost:3000/api/auth/verify-email?token=valid");
        const response = await GET(request as never);

        const location = response.headers.get("location")!;
        expect(location).toContain("/?error=EMAIL_CHANGE_CANCELED");
    });
});
