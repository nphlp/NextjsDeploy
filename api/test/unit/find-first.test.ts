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

    const findFirst = async ({
        where,
    }: {
        where: { name?: { contains: string }; lastname?: { contains: string } };
    }) => {
        const foundData = data.find((user) => {
            const nameMatch = user.name.includes(where.name?.contains ?? "");
            const lastnameMatch = user.lastname.includes(where.lastname?.contains ?? "");
            return nameMatch && lastnameMatch;
        });

        return foundData ?? null;
    };

    return {
        default: {
            user: { findFirst },
        },
    };
});

/**
 * Test `/users/first` endpoint permissions
 */
const oRpcUserFindFirst = oRPC.user.findFirst;

describe("GET /users/first (permissions)", () => {
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
        await expect(oRpcUserFindFirst({ name: "User", lastname: "Debug" })).rejects.toThrow();
    });

    it("Role user -> own profile", async () => {
        // Set user session
        setMockSession("USER");

        // Execute function (user searching for own profile)
        const user = await oRpcUserFindFirst({ name: "User", lastname: "Debug" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("userId");
        expect(user?.role).toBe("USER");
    });

    it("Role user -> other profile", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (not owner or admin)
        await expect(oRpcUserFindFirst({ name: "Admin", lastname: "Debug" })).rejects.toThrow();
    });

    it("Role vendor -> own profile", async () => {
        // Set vendor session
        setMockSession("VENDOR");

        // Execute function (vendor searching for own profile)
        const user = await oRpcUserFindFirst({ name: "Vendor", lastname: "Debug" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("vendorId");
        expect(user?.role).toBe("VENDOR");
    });

    it("Role vendor -> other profile", async () => {
        // Set vendor session
        setMockSession("VENDOR");

        // Expect unauthorized error (not owner or admin)
        await expect(oRpcUserFindFirst({ name: "User", lastname: "Debug" })).rejects.toThrow();
    });

    it("Role admin -> own profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin searching for own profile)
        const user = await oRpcUserFindFirst({ name: "Admin", lastname: "Debug" });

        // Expect user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("adminId");
        expect(user?.role).toBe("ADMIN");
    });

    it("Role admin -> other profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin searching for other user's profile)
        const user = await oRpcUserFindFirst({ name: "User", lastname: "Debug" });

        // Expect user object (admin can access any profile)
        expect(user).toBeDefined();
        expect(user?.id).toBe("userId");
        expect(user?.role).toBe("USER");
    });
});

describe("GET /users/first (params)", () => {
    it("User not found", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Expect not found error
        await expect(oRpcUserFindFirst({ name: "NonExistent", lastname: "Person" })).rejects.toThrow();
    });

    it("Find by exact name and lastname", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserFindFirst({ name: "Vendor", lastname: "Debug" });

        // Expect vendor user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("vendorId");
        expect(user?.name).toBe("Vendor");
        expect(user?.lastname).toBe("Debug");
    });

    it("Find by partial name", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (partial name match)
        const user = await oRpcUserFindFirst({ name: "Adm", lastname: "Debug" });

        // Expect admin user object (first match with contains)
        expect(user).toBeDefined();
        expect(user?.id).toBe("adminId");
        expect(user?.name).toBe("Admin");
    });

    it("Find by partial lastname", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (partial lastname match)
        const user = await oRpcUserFindFirst({ name: "Admin", lastname: "Deb" });

        // Expect admin user object
        expect(user).toBeDefined();
        expect(user?.id).toBe("adminId");
        expect(user?.lastname).toBe("Debug");
    });

    it("Find first returns first match", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (all users have lastname "Debug")
        const user = await oRpcUserFindFirst({ name: "Admin", lastname: "Debug" });

        // Expect first matching user (Admin is first in data array)
        expect(user).toBeDefined();
        expect(user?.id).toBe("adminId");
    });
});
