import { tag } from "@cache/api-utils";
import { getSession } from "@lib/auth-server";
import { os } from "@orpc/server";
import { Prisma } from "@prisma/client/client";
import { notFound, unauthorized } from "next/navigation";
import "server-only";
import { z } from "zod";
import { taskFindFirstCached, taskFindManyCached, taskFindUniqueCached } from "./task-cached";
import { taskOutputSchema } from "./task-schema";

const findMany = os
    .route({
        method: "GET",
        path: "/tasks",
        summary: "TASK Find Many",
    })
    .input(
        z
            .object({
                // Search
                search: z.string().optional().describe("Search term to filter tasks by title"),
                // Filtering
                userId: z.string().optional().describe("Filter by user ID (admin right)"),
                // Sorting
                updatedAt: z.enum(Prisma.SortOrder).optional().describe("Sort order for updatedAt"),
                // Pagination
                take: z.number().min(1).max(1000).optional().describe("Number of tasks to take"),
                skip: z.number().min(0).optional().describe("Number of tasks to skip"),
                // Cache tags
                cacheTags: z.array(z.string()).optional().describe("Array of cache tags"),
            })
            .optional(),
    )
    .output(z.array(taskOutputSchema))
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Admin can filter by userId, User can only see their own tasks
        const userIdFilter = isAdmin ? input?.userId : session.user.id;

        // Get task list
        const tasks = await taskFindManyCached(
            {
                take: input?.take,
                skip: input?.skip,
                orderBy: { updatedAt: input?.updatedAt },
                where: {
                    ...(input?.search && {
                        title: { contains: input?.search },
                    }),
                    userId: userIdFilter,
                },
            },
            [
                // Default cache tags
                tag("task"),
                tag("task", "findMany"),
                tag("task", "findMany", userIdFilter),
                tag("task", "findMany", input),
                // Provided cache tags
                ...(input?.cacheTags ?? []),
            ],
        );

        return tasks;
    });

const findUnique = os
    .route({
        method: "GET",
        path: "/tasks/{id}",
        summary: "TASK Find Unique",
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
            // Cache tags
            cacheTags: z.array(z.string()).optional().describe("Array of cache tags"),
        }),
    )
    .output(taskOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if task exists
        const task = await taskFindUniqueCached({ where: { id: input.id } }, [
            // Default cache tags
            tag("task"),
            tag("task", "findUnique"),
            tag("task", "findUnique", input.id),
            tag("task", "findUnique", input),
            // Provided cache tags
            ...(input?.cacheTags ?? []),
        ]);
        if (!task) notFound();

        // Check if user session is authorized to access this task
        const isAuthorized = isAdmin || task.userId === session.user.id;
        if (!isAuthorized) unauthorized();

        return task;
    });

const findFirst = os
    .route({
        method: "GET",
        path: "/tasks/first",
        summary: "TASK Find First",
    })
    .input(
        z.object({
            title: z.string().describe("Task title"),
            // Cache tags
            cacheTags: z.array(z.string()).optional().describe("Array of cache tags"),
        }),
    )
    .output(taskOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if task exists
        const task = await taskFindFirstCached({ where: { title: input.title } }, [
            // Default cache tags
            tag("task"),
            tag("task", "findFirst"),
            tag("task", "findFirst", input),
            // Provided cache tags
            ...(input?.cacheTags ?? []),
        ]);
        if (!task) notFound();

        // Check if user session is authorized to access this task
        const isAuthorized = isAdmin || task.userId === session.user.id;
        if (!isAuthorized) unauthorized();

        return task;
    });

export const taskQueries = {
    findMany,
    findUnique,
    findFirst,
};

export default taskQueries;
