import { User } from "@prisma/client/client";
import { oRPC_bypass_http as oRPC } from "@test/mocks/orpc";
import { setMockSession } from "@test/mocks/session";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Node Modules mocks
vi.mock("next/cache", async () => import("@test/mocks/modules/next-cache"));
vi.mock("@lib/auth-server", async () => import("@test/mocks/modules/auth-server"));

// Mock SendEmailAction (fire-and-forget in the actions)
vi.mock("@actions/send-email", () => ({ default: vi.fn() }));
vi.mock("@comps/email-template", () => ({ default: vi.fn() }));
vi.mock("@lib/env", () => ({
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
}));

// PrismaInstance mock
vi.mock("@lib/prisma", () => {
    const data: User[] = [
        {
            id: "adminId",
            name: "Admin",
            lastname: "Debug",
            email: "admin@test.com",
            emailVerified: true,
            image: null,
            role: "ADMIN",
            twoFactorEnabled: false,
            pendingEmail: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "userId",
            name: "User",
            lastname: "Debug",
            email: "user@test.com",
            emailVerified: true,
            image: null,
            role: "USER",
            twoFactorEnabled: false,
            pendingEmail: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const update = async ({
        data: input,
        where,
    }: {
        data: { pendingEmail?: string | null };
        where: { id: string };
    }) => {
        const user = data.find((u) => u.id === where.id);
        if (!user) return null;
        return { ...user, pendingEmail: input.pendingEmail ?? user.pendingEmail, updatedAt: new Date() };
    };

    return {
        default: { user: { update } },
    };
});

describe("PUT /users/pending-email (setPendingEmail)", () => {
    beforeEach(() => setMockSession(null));

    it("visitor cannot set pending email", async () => {
        setMockSession(null);
        await expect(oRPC.user.setPendingEmail({ newEmail: "new@test.com" })).rejects.toThrow();
    });

    it("authenticated user can set pending email", async () => {
        setMockSession("USER");
        const result = await oRPC.user.setPendingEmail({ newEmail: "new@test.com" });
        expect(result).toBeDefined();
        expect(result.pendingEmail).toBe("new@test.com");
    });
});

describe("DELETE /users/pending-email (cancelPendingEmail)", () => {
    beforeEach(() => setMockSession(null));

    it("visitor cannot cancel pending email", async () => {
        setMockSession(null);
        await expect(oRPC.user.cancelPendingEmail({})).rejects.toThrow();
    });

    it("authenticated user can cancel pending email", async () => {
        setMockSession("USER");
        const result = await oRPC.user.cancelPendingEmail({});
        expect(result).toBeDefined();
        expect(result.pendingEmail).toBeNull();
    });
});
