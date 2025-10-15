import { Fetch } from "@utils/Fetch";
import { describe, expect, it } from "vitest";

describe("API fetch tests", () => {
    it("User FindFirst API", async () => {
        const user = await Fetch({
            route: "/internal/user/findFirst",
            params: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    Account: { select: { id: true } },
                    Session: { select: { id: true } },
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
        expect(user).toHaveProperty("Account");
        expect(user).toHaveProperty("Session");
        expect(Array.isArray(user.Account)).toBe(true);
        expect(Array.isArray(user.Session)).toBe(true);

        // If there are related accounts or sessions, check their properties
        if (user.Account.length > 0) expect(user.Account[0]).toHaveProperty("id");
        if (user.Session.length > 0) expect(user.Session[0]).toHaveProperty("id");
    });

    it("User FindUnique API", async () => {
        const firstUser = await Fetch({
            route: "/internal/user/findFirst",
            params: {
                select: { id: true },
            },
        });

        if (!firstUser?.id) throw new Error("First user not found");

        // Tested function
        const user = await Fetch({
            route: "/internal/user/findUnique",
            params: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    Account: { select: { id: true } },
                    Session: { select: { id: true } },
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
        expect(user).toHaveProperty("Account");
        expect(user).toHaveProperty("Session");
        expect(Array.isArray(user.Account)).toBe(true);
        expect(Array.isArray(user.Session)).toBe(true);

        // If there are related accounts or sessions, check their properties
        if (user.Account.length > 0) expect(user.Account[0]).toHaveProperty("id");
        if (user.Session.length > 0) expect(user.Session[0]).toHaveProperty("id");
    });

    it("User FindMany API", async () => {
        // Tested function
        const users = await Fetch({
            route: "/internal/user/findMany",
            params: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    Account: { select: { id: true } },
                    Session: { select: { id: true } },
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
        expect(users[0]).toHaveProperty("Account");
        expect(users[0]).toHaveProperty("Session");
        expect(Array.isArray(users[0].Account)).toBe(true);
        expect(Array.isArray(users[0].Session)).toBe(true);

        // If there are related accounts or sessions, check their properties
        if (users[0].Account.length > 0) expect(users[0].Account[0]).toHaveProperty("id");
        if (users[0].Session.length > 0) expect(users[0].Session[0]).toHaveProperty("id");
    });

    it("User Count API", async () => {
        // Tested function
        const userCount = await Fetch({
            route: "/internal/user/count",
        });

        // Check userCount
        expect(userCount).toBeDefined();
        expect(userCount).toBeGreaterThan(0);
        expect(typeof userCount).toBe("number");
    });
});
