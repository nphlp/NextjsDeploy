import { Fruit } from "@prisma/client/client";
import { oRPC_bypass_http as oRPC } from "@test/mocks/orpc";
import { describe, expect, it, vi } from "vitest";

// Node Modules mocks
vi.mock("next/cache", async () => import("@test/mocks/modules/next-cache"));
vi.mock("@lib/auth-server", async () => import("@test/mocks/modules/auth-server"));

// PrismaInstance mock
vi.mock("@lib/prisma", () => {
    const data: Fruit[] = [
        {
            id: "fruitId1",
            name: "Apple",
            description: "A red fruit",
            userId: "userId",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01"),
        },
        {
            id: "fruitId2",
            name: "Banana",
            description: "A yellow fruit",
            userId: "adminId",
            createdAt: new Date("2024-01-02"),
            updatedAt: new Date("2024-01-02"),
        },
        {
            id: "fruitId3",
            name: "Cherry",
            description: "A small red fruit",
            userId: "vendorId",
            createdAt: new Date("2024-01-03"),
            updatedAt: new Date("2024-01-03"),
        },
    ];

    const count = async ({
        where,
    }: {
        where?: { name?: { contains: string; mode: string }; id?: { notIn: string[] } };
    }) => {
        let result = [...data];

        // Filter by search
        if (where?.name?.contains) {
            const search = where.name.contains.toLowerCase();
            result = result.filter((fruit) => fruit.name.toLowerCase().includes(search));
        }

        // Filter by excludeIds
        if (where?.id?.notIn) {
            result = result.filter((fruit) => !where.id!.notIn.includes(fruit.id));
        }

        return result.length;
    };

    return {
        default: {
            fruit: { count },
        },
    };
});

/**
 * Test `GET /fruits/count` endpoint (public)
 */
const oRpcFruitCount = oRPC.fruit.count;

describe("GET /fruits/count (public)", () => {
    it("Returns total count", async () => {
        const count = await oRpcFruitCount();
        expect(count).toBe(3);
    });

    it("Returns count with search filter", async () => {
        const count = await oRpcFruitCount({ searchByName: "apple" });
        expect(count).toBe(1);
    });

    it("Returns 0 for no matches", async () => {
        const count = await oRpcFruitCount({ searchByName: "xyz" });
        expect(count).toBe(0);
    });

    it("Returns count with excludeIds", async () => {
        const count = await oRpcFruitCount({ excludeIds: ["fruitId1"] });
        expect(count).toBe(2);
    });

    it("Returns count with excludeIds and search", async () => {
        const count = await oRpcFruitCount({ searchByName: "a", excludeIds: ["fruitId1"] });
        expect(count).toBe(1); // Banana matches "a", Apple excluded
    });
});
