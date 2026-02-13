import { User } from "@prisma/client/client";
import { oRPC_bypass_http as oRPC } from "@test/mocks/orpc";
import { setMockSession } from "@test/mocks/session";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Node Modules mocks
vi.mock("next/cache", async () => import("@test/mocks/modules/next-cache"));
vi.mock("@lib/auth-server", async () => import("@test/mocks/modules/auth-server"));

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
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const findMany = async ({ take, skip }: { take?: number; skip?: number }) => {
        const start = skip ?? 0;
        const end = take ? start + take : undefined;

        return data.slice(start, end);
    };

    return {
        default: {
            user: { findMany },
        },
    };
});

/**
 * Test `/users` endpoint permissions
 */
const oRpcUserFindMany = oRPC.user.findMany;

describe("GET /users (permissions)", () => {
    /**
     * Reset session before each test
     */
    beforeEach(() => {
        setMockSession(null);
    });

    it("Role visitor", async () => {
        // Set no session (visitor)
        setMockSession(null);

        // Expect unauthorized error (not logged in)
        await expect(oRpcUserFindMany()).rejects.toThrow();
    });

    it("Role user", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (not admin)
        await expect(oRpcUserFindMany()).rejects.toThrow();
    });

    it("Role admin", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const users = await oRpcUserFindMany();

        // Expect array of user objects
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(2);
    });
});

describe("GET /users (params)", () => {
    it("Take 2", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const users = await oRpcUserFindMany({ take: 2 });

        // Expect array of user objects
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(2);

        // Expect both users
        expect(users[0].id).toBe("adminId");
        expect(users[1].id).toBe("userId");
    });

    it("Skip 1", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const users = await oRpcUserFindMany({ skip: 1 });

        // Expect array of user objects
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(1);

        // Expect user after skipping first
        expect(users[0].id).toBe("userId");
    });
});
