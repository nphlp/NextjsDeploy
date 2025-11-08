import { describe, expect, it } from "vitest";
import Solid from "@/solid/solid-fetch";

describe("API fetch tests", () => {
    it("User FindFirst API", async () => {
        const user = await Solid({
            route: "/solid/user/findFirst",
            params: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    Accounts: { select: { id: true } },
                    Sessions: { select: { id: true } },
                },
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

    it("User FindUnique API", async () => {
        const firstUser = await Solid({
            route: "/solid/user/findFirst",
            params: {
                select: { id: true },
            },
        });

        if (!firstUser?.id) throw new Error("First user not found");

        // Tested function
        const user = await Solid({
            route: "/solid/user/findUnique",
            params: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    Accounts: { select: { id: true } },
                    Sessions: { select: { id: true } },
                },
                where: { id: firstUser.id },
            },
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

    it("User FindMany API", async () => {
        // Tested function
        const users = await Solid({
            route: "/solid/user/findMany",
            params: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    Accounts: { select: { id: true } },
                    Sessions: { select: { id: true } },
                },
                take: 10,
            },
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

    it("User Count API", async () => {
        // Tested function
        const userCount = await Solid({
            route: "/solid/user/count",
        });

        // Check userCount
        expect(userCount).toBeDefined();
        expect(userCount).toBeGreaterThan(0);
        expect(typeof userCount).toBe("number");
    });
});
