import { beforeEach, describe, expect, it, vi } from "vitest";
import { oRPC_bypass_http as oRPC } from "../mocks/orpc";
import { setMockSession } from "../mocks/session";

// Node Modules mocks
vi.mock("server-only", async () => import("../mocks/modules/server-only"));
vi.mock("next/cache", async () => import("../mocks/modules/next-cache"));
vi.mock("@lib/auth-server", async () => import("../mocks/modules/auth-server"));

// PrismaInstance mock
vi.mock("@lib/prisma", () => {
    const data = [
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
            id: "vendorId",
            name: "Vendor",
            lastname: "Debug",
            email: "vendor@test.com",
            emailVerified: true,
            image: null,
            role: "VENDOR",
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

    it("Role vendor -> own profile", async () => {
        // Set vendor session
        setMockSession("VENDOR");

        // Execute function (vendor accessing own profile)
        const user = await oRpcUserFindUnique({ id: "vendorId" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("vendorId");
        expect(user?.role).toBe("VENDOR");
    });

    it("Role vendor -> other profile", async () => {
        // Set vendor session
        setMockSession("VENDOR");

        // Expect unauthorized error (not owner or admin)
        await expect(oRpcUserFindUnique({ id: "userId" })).rejects.toThrow();
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

    it("Get vendor by id", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserFindUnique({ id: "vendorId" });

        // Expect vendor user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("vendorId");
        expect(user?.name).toBe("Vendor");
        expect(user?.email).toBe("vendor@test.com");
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
