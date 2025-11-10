import { getSession } from "@lib/auth-server";
import { os } from "@orpc/server";
import { Prisma } from "@prisma/client";
import { formatStringArrayLineByLine } from "@utils/string-format";
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
        description: formatStringArrayLineByLine([
            "**Search**",
            "  - [ ] Search term to filter tasks by title",
            "\n",
            "**Filtering**",
            "  - [ ] Filter by user ID (admin right)",
            "\n",
            "**Sorting**",
            "  - [ ] Sort order for updatedAt",
            "\n",
            "**Pagination**",
            "  - [ ] Take: Number of tasks to take (min: 1, max: 1000)",
            "  - [ ] Skip: Number of tasks to skip (min: 0)",
            "\n",
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Get every tasks",
            "  - [ ] Get tasks of any user by filtering with user ID",
            "- **User**",
            "  - [ ] Get its own tasks only",
        ]),
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
            [`taskFindManyCached`, `taskFindManyCached-${userIdFilter}`],
        );

        return tasks;
    });

const findUnique = os
    .route({
        method: "GET",
        path: "/tasks/{id}",
        summary: "TASK Find Unique",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Get task of any user",
            "- **User**",
            "  - [ ] Get its own task only",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
        }),
    )
    .output(taskOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if task exists
        const task = await taskFindUniqueCached({ where: { id: input.id } }, [
            `taskFindUniqueCached`,
            `taskFindUniqueCached-${input.id}`,
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
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Get task of any user",
            "- **User**",
            "  - [ ] Get its own task only",
        ]),
    })
    .input(
        z.object({
            title: z.string().describe("Task title"),
        }),
    )
    .output(taskOutputSchema.nullable())
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if task exists
        const task = await taskFindFirstCached({ where: { title: input.title } }, [
            `taskFindFirstCached`,
            `taskFindFirstCached-${JSON.stringify(input)}`,
        ]);
        if (!task) notFound();

        // Check if user session is authorized to access this task
        const isAuthorized = isAdmin || task.userId === session.user.id;
        if (!isAuthorized) unauthorized();

        return task;
    });

export const taskQueries = () => ({
    findMany,
    findUnique,
    findFirst,
});

export default taskQueries;
