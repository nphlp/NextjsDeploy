import { tag } from "@cache/api-utils";
import { getSession } from "@lib/auth-server";
import { os } from "@orpc/server";
import { notFound, unauthorized } from "next/navigation";
import "server-only";
import { z } from "zod";
import { userFindFirstCached, userFindManyCached, userFindUniqueCached } from "./user-cached";
import { userOutputSchema } from "./user-schema";

const findMany = os
    .route({
        method: "GET",
        path: "/users",
        summary: "USER Find Many",
    })
    .input(
        z
            .object({
                take: z.number().min(1).max(1000).optional().describe("Number of users to take"),
                skip: z.number().min(0).optional().describe("Number of users to skip"),
            })
            .optional(),
    )
    .output(z.array(userOutputSchema))
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        // Only admin can get user list
        const isAdmin = session.user.role === "ADMIN";
        if (!isAdmin) unauthorized();

        // Get user list
        const users = await userFindManyCached(
            {
                take: input?.take,
                skip: input?.skip,
            },
            [
                // Default cache tags
                tag("user"),
                tag("user", "findMany"),
                tag("user", "findMany", input),
            ],
        );

        return users;
    });

const findUnique = os
    .route({
        method: "GET",
        path: "/users/{id}",
        summary: "USER Find Unique",
    })
    .input(
        z.object({
            id: z.string().describe("User ID"),
        }),
    )
    .output(userOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if user exists (cached)
        const user = await userFindUniqueCached({ where: { id: input.id } }, [
            // Default cache tags
            tag("user"),
            tag("user", "findUnique"),
            tag("user", "findUnique", input.id),
            tag("user", "findUnique", input),
        ]);
        if (!user) notFound();

        // Check if user session is authorized to access this user
        const isAuthorized = isAdmin || user.id === session.user.id;
        if (!isAuthorized) unauthorized();

        return user;
    });

const findFirst = os
    .route({
        method: "GET",
        path: "/users/first",
        summary: "USER Find First",
    })
    .input(
        z.object({
            name: z.string().describe("User name"),
            lastname: z.string().describe("User lastname"),
        }),
    )
    .output(userOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if user exists (cached)
        const user = await userFindFirstCached(
            {
                where: {
                    name: { contains: input.name },
                    lastname: { contains: input.lastname },
                },
            },
            [
                // Default cache tags
                tag("user"),
                tag("user", "findFirst"),
                tag("user", "findFirst", input),
            ],
        );
        if (!user) notFound();

        // Check if user session is authorized to access this user
        const isAuthorized = isAdmin || user.id === session.user.id;
        if (!isAuthorized) unauthorized();

        return user;
    });

export const userQueries = {
    findMany,
    findUnique,
    findFirst,
};

export default userQueries;
