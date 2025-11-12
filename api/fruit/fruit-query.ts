import { os } from "@orpc/server";
import { Prisma } from "@prisma/client";
import { deepPropsSort, formatStringArrayLineByLine } from "@utils/string-format";
import "server-only";
import { z } from "zod";
import { fruitFindManyCached } from "./fruit-cached";
import { fruitOutputSchema } from "./fruit-schema";

const findMany = os
    .route({
        method: "GET",
        path: "/fruits",
        summary: "FRUIT Find Many",
        description: formatStringArrayLineByLine([
            "**Search**",
            "  - [ ] Search term to filter fruits by name",
            "\n",
            "**Filtering**",
            "  - [ ] Filter by name",
            "\n",
            "**Sorting**",
            "  - [ ] Sort order for name or updatedAt",
            "\n",
            "**Pagination**",
            "  - [ ] Take: Number of fruits to take (min: 1, max: 1000)",
            "  - [ ] Skip: Number of fruits to skip (min: 0)",
            "\n",
            "**Permissions**",
            "  - [ ] Public access - no authentication required",
            "**Cache tags**",
            "  - [ ] Precise custom cache tags for revalidation",
        ]),
    })
    .input(
        z
            .object({
                // Search
                search: z.string().optional().describe("Search term to filter fruits by name"),
                // Sorting
                name: z.enum(Prisma.SortOrder).optional().describe("Sort order for name"),
                updatedAt: z.enum(Prisma.SortOrder).optional().describe("Sort order for updatedAt"),
                // Pagination
                take: z.number().min(1).max(1000).optional().describe("Number of fruits to take"),
                skip: z.number().min(0).optional().describe("Number of fruits to skip"),
                // Cache tags
                cacheTags: z.array(z.string()).optional().describe("Array of cache tags"),
            })
            .optional(),
    )
    .output(z.array(fruitOutputSchema))
    .handler(async ({ input }) => {
        // No authentication required - public access

        // Get fruit list
        const fruits = await fruitFindManyCached(
            {
                take: input?.take,
                skip: input?.skip,
                orderBy: {
                    ...(input?.name && { name: input.name }),
                    ...(input?.updatedAt && { updatedAt: input.updatedAt }),
                },
                where: {
                    ...(input?.search && {
                        name: { contains: input.search, mode: "insensitive" },
                    }),
                },
            },
            [
                `fruitFindManyCached`,
                `fruitFindManyCached-${deepPropsSort(input)}`,
                // Provided cache tags
                ...(input?.cacheTags ?? []),
            ],
        );

        return fruits;
    });

export const fruitQueries = () => ({
    findMany,
});

export default fruitQueries;
