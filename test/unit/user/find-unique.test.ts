import { User } from "@prisma/client/client";
import { oRPC_bypass_http as oRPC } from "@test/mocks/orpc";
import { setMockSession } from "@test/mocks/session";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Node Modules mocks
vi.mock("server-only", async () => import("@test/mocks/modules/server-only"));
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

    const findUnique = async ({ where }: { where: { id: string } }) => {
        return data.find((user) => user.id === where.id) ?? null;
    };

    return {
        default: {
            user: { findUnique },
        },
    };
});

/**
 * Test `/users/{id}` endpoint permissions
 */
const oRpcUserFindUnique = oRPC.user.findUnique;

describe("GET /users/{id} (permissions)", () => {
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
        await expect(oRpcUserFindUnique({ id: "userId" })).rejects.toThrow();
    });

    it("Role user -> own profile", async () => {
        // Set user session
        setMockSession("USER");

        // Execute function (user accessing own profile)
        const user = await oRpcUserFindUnique({ id: "userId" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("userId");
        expect(user?.role).toBe("USER");
    });

    it("Role user -> other profile", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (not owner or admin)
        await expect(oRpcUserFindUnique({ id: "adminId" })).rejects.toThrow();
    });

    it("Role admin -> own profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin accessing own profile)
        const user = await oRpcUserFindUnique({ id: "adminId" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("adminId");
        expect(user?.role).toBe("ADMIN");
    });

    it("Role admin -> other profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin accessing other user's profile)
        const user = await oRpcUserFindUnique({ id: "userId" });

        // Expect user object (admin can access any profile)
        expect(user).toBeDefined();
        expect(user?.id).toBe("userId");
        expect(user?.role).toBe("USER");
    });
});

describe("GET /users/{id} (params)", () => {
    it("User not found", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Expect not found error
        await expect(oRpcUserFindUnique({ id: "nonExistentId" })).rejects.toThrow();
    });

    it("Get admin by id", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserFindUnique({ id: "adminId" });

        // Expect admin user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("adminId");
        expect(user?.name).toBe("Admin");
        expect(user?.email).toBe("admin@test.com");
    });

    it("Get user by id", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserFindUnique({ id: "userId" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("userId");
        expect(user?.name).toBe("User");
        expect(user?.email).toBe("user@test.com");
    });
});
