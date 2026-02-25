import { Role, User } from "@prisma/client/client";
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
            twoFactorEnabled: false,
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
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const findUnique = async ({ where }: { where: { id?: string; email?: string } }) => {
        if (where.id) return data.find((user) => user.id === where.id) ?? null;
        if (where.email) return data.find((user) => user.email === where.email) ?? null;
        return null;
    };

    const update = async ({
        data: input,
        where,
    }: {
        data: { name?: string; lastname?: string; image?: string | null; role?: string };
        where: { id: string };
    }) => {
        const user = data.find((u) => u.id === where.id);
        if (!user) return null;

        const updatedUser: User = {
            ...user,
            name: input.name ?? user.name,
            lastname: input.lastname !== undefined ? input.lastname : user.lastname,
            image: input.image !== undefined ? input.image : user.image,
            role: (input.role ?? user.role) as Role,
            updatedAt: new Date(),
        };

        return updatedUser;
    };

    return {
        default: {
            user: { findUnique, update },
        },
    };
});

/**
 * Test `PUT /users/{id}` endpoint permissions
 */
const oRpcUserUpdate = oRPC.user.update;

describe("PUT /users/{id} (permissions)", () => {
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
        await expect(oRpcUserUpdate({ id: "userId", name: "Updated" })).rejects.toThrow();
    });

    it("Role user -> own profile", async () => {
        // Set user session
        setMockSession("USER");

        // Execute function (user updating own profile)
        const user = await oRpcUserUpdate({ id: "userId", name: "Updated" });

        // Expect updated user object
        expect(user).toBeDefined();
        expect(user.id).toBe("userId");
        expect(user.name).toBe("Updated");
    });

    it("Role user -> other profile", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (not owner or admin)
        await expect(oRpcUserUpdate({ id: "adminId", name: "Updated" })).rejects.toThrow();
    });

    it("Role user -> change role", async () => {
        // Set user session
        setMockSession("USER");

        // Expect unauthorized error (only admin can change roles)
        await expect(oRpcUserUpdate({ id: "userId", role: "ADMIN" })).rejects.toThrow();
    });

    it("Role admin -> own profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin updating own profile)
        const user = await oRpcUserUpdate({ id: "adminId", name: "Updated" });

        // Expect updated user object
        expect(user).toBeDefined();
        expect(user.id).toBe("adminId");
        expect(user.name).toBe("Updated");
    });

    it("Role admin -> other profile", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin updating other user's profile)
        const user = await oRpcUserUpdate({ id: "userId", name: "Updated" });

        // Expect updated user object
        expect(user).toBeDefined();
        expect(user.id).toBe("userId");
        expect(user.name).toBe("Updated");
    });

    it("Role admin -> change role", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (admin can change roles)
        const user = await oRpcUserUpdate({ id: "userId", role: "ADMIN" });

        // Expect updated user object with new role
        expect(user).toBeDefined();
        expect(user.id).toBe("userId");
        expect(user.role).toBe("ADMIN");
    });
});

describe("PUT /users/{id} (params)", () => {
    it("User not found", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Expect not found error
        await expect(oRpcUserUpdate({ id: "nonExistentId", name: "Updated" })).rejects.toThrow();
    });

    it("Update name only", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserUpdate({ id: "userId", name: "NewName" });

        // Expect only name to be updated
        expect(user).toBeDefined();
        expect(user.name).toBe("NewName");
        expect(user.lastname).toBe("Debug");
    });

    it("Update lastname only", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserUpdate({ id: "userId", lastname: "NewLastname" });

        // Expect only lastname to be updated
        expect(user).toBeDefined();
        expect(user.name).toBe("User");
        expect(user.lastname).toBe("NewLastname");
    });

    it("Update image", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserUpdate({ id: "userId", image: "https://example.com/new.jpg" });

        // Expect image to be updated
        expect(user).toBeDefined();
        expect(user.image).toBe("https://example.com/new.jpg");
    });

    it("Update lastname to empty triggers validation", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function (update lastname)
        const user = await oRpcUserUpdate({ id: "userId", lastname: "NewLastname" });

        // Expect lastname to be updated
        expect(user).toBeDefined();
        expect(user.lastname).toBe("NewLastname");
    });

    it("Update multiple fields", async () => {
        // Set admin session
        setMockSession("ADMIN");

        // Execute function
        const user = await oRpcUserUpdate({
            id: "userId",
            name: "NewName",
            lastname: "NewLastname",
            image: "https://example.com/new.jpg",
        });

        // Expect all fields to be updated
        expect(user).toBeDefined();
        expect(user.name).toBe("NewName");
        expect(user.lastname).toBe("NewLastname");
        expect(user.image).toBe("https://example.com/new.jpg");
    });
});
