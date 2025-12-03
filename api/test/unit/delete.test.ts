import { User } from "@prisma/client/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { oRPC_bypass_http as oRPC } from "../mocks/orpc";
import { setMockSession } from "../mocks/session";

// Node Modules mocks
vi.mock("server-only", async () => import("../mocks/modules/server-only"));
vi.mock("next/cache", async () => import("../mocks/modules/next-cache"));
vi.mock("@lib/auth-server", async () => import("../mocks/modules/auth-server"));

// PrismaInstance mock
const createInitialData = (): User[] => [
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

let data: User[] = createInitialData();

// Reset data before each test
beforeEach(() => {
    data = createInitialData();
});

vi.mock("@lib/prisma", () => {
    const findUnique = async ({ where }: { where: { id?: string; email?: string } }) => {
        if (where.id) return data.find((user) => user.id === where.id) ?? null;
        if (where.email) return data.find((user) => user.email === where.email) ?? null;
        return null;
    };

    const deleting = async ({ where }: { where: { id: string } }) => {
        const index = data.findIndex((u) => u.id === where.id);
        if (index === -1) return null;

        const deletedUser = data[index];
        data.splice(index, 1);

        return deletedUser;
    };

    return {
        default: {
            user: { findUnique, delete: deleting },
        },
    };
});

/**
 * Test `DELETE /users/{id}` endpoint permissions
 */
const oRpcUserDelete = oRPC.user.delete;

describe("DELETE /users/{id} (permissions)", () => {
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
        await expect(oRpcUserDelete({ id: "userId" })).rejects.toThrow();
    });

    it("Role user", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (not admin)
        await expect(oRpcUserDelete({ id: "vendorId" })).rejects.toThrow();
    });

    it("Role user -> own profile", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (only admin can delete)
        await expect(oRpcUserDelete({ id: "userId" })).rejects.toThrow();
    });

    it("Role vendor", async () => {
        // Set vendor session
        setMockSession("VENDOR");

        // Expect unauthorized error (not admin)
        await expect(oRpcUserDelete({ id: "userId" })).rejects.toThrow();
    });

    it("Role vendor -> own profile", async () => {
        // Set vendor session
        setMockSession("VENDOR");

        // Expect unauthorized error (only admin can delete)
        await expect(oRpcUserDelete({ id: "vendorId" })).rejects.toThrow();
    });

    it("Role admin -> own profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Expect unauthorized error (admin cannot delete themselves)
        await expect(oRpcUserDelete({ id: "adminId" })).rejects.toThrow();
    });

    it("Role admin -> other profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin deleting other user)
        const user = await oRpcUserDelete({ id: "userId" });

        // Expect deleted user object
        expect(user).toBeDefined();
        expect(user.id).toBe("userId");
    });
});

describe("DELETE /users/{id} (params)", () => {
    it("User not found", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Expect not found error
        await expect(oRpcUserDelete({ id: "nonExistentId" })).rejects.toThrow();
    });

    it("Delete user", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserDelete({ id: "userId" });

        // Expect deleted user object
        expect(user).toBeDefined();
        expect(user.id).toBe("userId");
        expect(user.name).toBe("User");
        expect(user.email).toBe("user@test.com");
    });

    it("Delete vendor", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserDelete({ id: "vendorId" });

        // Expect deleted user object
        expect(user).toBeDefined();
        expect(user.id).toBe("vendorId");
        expect(user.name).toBe("Vendor");
        expect(user.email).toBe("vendor@test.com");
    });
});
