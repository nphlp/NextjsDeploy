import {
    UserCountAction,
    UserCreateAction,
    UserDeleteAction,
    UserFindFirstAction,
    UserFindManyAction,
    UserFindUniqueAction,
    UserUpdateAction,
} from "@services/actions/UserAction";
import { describe, expect, it } from "vitest";

describe("Actions mutations tests", () => {
    it("User Create Action", async () => {
        const user = await UserCreateAction({
            data: {
                id: "test-id",
                email: "test@example.com",
                name: "test-name",
                lastname: "test-lastname",
                role: "USER",
                emailVerified: true,
                Accounts: {
                    create: {
                        id: "test-account-id",
                        accountId: "test-account-accountId",
                        providerId: "test-account-providerId",
                    },
                },
                Sessions: {
                    create: {
                        id: "test-session-id",
                        token: "test-token",
                        expiresAt: new Date(Date.UTC(2050, 0, 1, 0, 0, 0)),
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                Accounts: { select: { id: true } },
                Sessions: { select: { id: true } },
            },
        });

        // Check users
        expect(user).toBeDefined();

        // Check properties
        expect(user.id).toBe("test-id");
        expect(user.email).toBe("test@example.com");
        expect(user.name).toBe("test-name");
        expect(user.lastname).toBe("test-lastname");

        // Check relations
        expect(user).toHaveProperty("Accounts");
        expect(user).toHaveProperty("Sessions");

        expect(Array.isArray(user.Accounts)).toBe(true);
        expect(Array.isArray(user.Sessions)).toBe(true);

        expect(user.Accounts.length).toBe(1);
        expect(user.Sessions.length).toBe(1);

        // If there are related accounts or sessions, check their properties
        if (user.Accounts.length > 0) expect(user.Accounts[0].id).toBe("test-account-id");
        if (user.Sessions.length > 0) expect(user.Sessions[0].id).toBe("test-session-id");
    });

    it("User Update Action", async () => {
        const user = await UserUpdateAction({
            where: { id: "test-id" },
            data: {
                email: "test@example.com-2",
                name: "test-name-2",
                lastname: "test-lastname-2",
                emailVerified: true,
                Accounts: {
                    create: {
                        id: "test-account-id-2",
                        accountId: "test-account-accountId-2",
                        providerId: "test-account-providerId-2",
                    },
                },
                Sessions: {
                    create: {
                        id: "test-session-id-2",
                        token: "test-token-2",
                        expiresAt: new Date(Date.UTC(2050, 0, 1, 0, 0, 0)),
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                Accounts: { select: { id: true } },
                Sessions: { select: { id: true } },
            },
        });

        // Check users
        expect(user).toBeDefined();

        // Check properties
        expect(user.id).toBe("test-id");
        expect(user.email).toBe("test@example.com-2");
        expect(user.name).toBe("test-name-2");
        expect(user.lastname).toBe("test-lastname-2");

        // Check relations
        expect(user).toHaveProperty("Accounts");
        expect(user).toHaveProperty("Sessions");

        expect(Array.isArray(user.Accounts)).toBe(true);
        expect(Array.isArray(user.Sessions)).toBe(true);

        expect(user.Accounts.length).toBe(2);
        expect(user.Sessions.length).toBe(2);

        // If there are related accounts or sessions, check their properties
        if (user.Accounts.length > 0) expect(user.Accounts[0].id).toBe("test-account-id");
        if (user.Accounts.length > 0) expect(user.Accounts[1].id).toBe("test-account-id-2");

        if (user.Sessions.length > 0) expect(user.Sessions[0].id).toBe("test-session-id");
        if (user.Sessions.length > 0) expect(user.Sessions[1].id).toBe("test-session-id-2");
    });

    it("User Delete Action", async () => {
        const deletedUser = await UserDeleteAction({
            where: { id: "test-id" },
        });

        const existingUser = await UserFindUniqueAction({
            where: { id: "test-id" },
        });

        // Check users
        expect(deletedUser).toBeDefined();

        // Check that the user has been deleted
        expect(existingUser).toBeNull();
    });
});

describe("Actions fetch tests", () => {
    it("User FindFirst Action", async () => {
        const user = await UserFindFirstAction({
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                Accounts: { select: { id: true } },
                Sessions: { select: { id: true } },
            },
        });

        if (!user?.id) throw new Error("First user not found");

        // Check users
        expect(user).toBeDefined();

        // Check properties
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("lastname");

        // Check relations
        expect(user).toHaveProperty("Accounts");
        expect(user).toHaveProperty("Sessions");
        expect(Array.isArray(user.Accounts)).toBe(true);
        expect(Array.isArray(user.Sessions)).toBe(true);

        // If there are related accounts or sessions, check their properties
        if (user.Accounts.length > 0) expect(user.Accounts[0]).toHaveProperty("id");
        if (user.Sessions.length > 0) expect(user.Sessions[0]).toHaveProperty("id");
    });

    it("User FindUnique Action", async () => {
        const firstUser = await UserFindFirstAction({
            select: { id: true },
        });

        if (!firstUser?.id) throw new Error("First user not found");

        // Tested function
        const user = await UserFindUniqueAction({
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                Accounts: { select: { id: true } },
                Sessions: { select: { id: true } },
            },
            where: { id: firstUser.id },
        });

        if (!user) throw new Error("Unique user not found");

        // Check users
        expect(user).toBeDefined();

        // Check properties
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("lastname");

        // Check relations
        expect(user).toHaveProperty("Accounts");
        expect(user).toHaveProperty("Sessions");
        expect(Array.isArray(user.Accounts)).toBe(true);
        expect(Array.isArray(user.Sessions)).toBe(true);

        // If there are related accounts or sessions, check their properties
        if (user.Accounts.length > 0) expect(user.Accounts[0]).toHaveProperty("id");
        if (user.Sessions.length > 0) expect(user.Sessions[0]).toHaveProperty("id");
    });

    it("User FindMany Action", async () => {
        // Tested function
        const users = await UserFindManyAction({
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                Accounts: { select: { id: true } },
                Sessions: { select: { id: true } },
            },
            take: 10,
        });

        // Check users
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        expect(users.length).toBeLessThanOrEqual(10);

        // Check properties
        expect(users[0]).toHaveProperty("id");
        expect(users[0]).toHaveProperty("email");
        expect(users[0]).toHaveProperty("name");
        expect(users[0]).toHaveProperty("lastname");

        // Check relations
        expect(users[0]).toHaveProperty("Accounts");
        expect(users[0]).toHaveProperty("Sessions");
        expect(Array.isArray(users[0].Accounts)).toBe(true);
        expect(Array.isArray(users[0].Sessions)).toBe(true);

        // If there are related accounts or sessions, check their properties
        if (users[0].Accounts.length > 0) expect(users[0].Accounts[0]).toHaveProperty("id");
        if (users[0].Sessions.length > 0) expect(users[0].Sessions[0]).toHaveProperty("id");
    });

    it("User Count Action", async () => {
        // Tested function
        const userCount = await UserCountAction({});

        // Check userCount
        expect(userCount).toBeDefined();
        expect(userCount).toBeGreaterThan(0);
        expect(typeof userCount).toBe("number");
    });
});
