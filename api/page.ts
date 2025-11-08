import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { $Enums, Prisma } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z from "zod";

const getTasksPageFindMany = async (props: Prisma.TaskFindManyArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.task.findMany(props);
};

const getTasksPage = os
    .route({
        method: "GET",
        path: "/tasks-page",
        summary: "Get data for /tasks page",
    })
    .input(
        z
            .object({
                search: z.string().optional().describe("Search term to filter tasks by title"),
                updatedAt: z.enum(Prisma.SortOrder).optional().describe("Sort order for updatedAt"),
                userId: z.string().optional().describe("Filter by user ID (admin right)"),
            })
            .optional(),
    )
    .output(
        z.array(
            z.object({
                id: z.string().describe("Unique ID of the task (nanoid)"),
                title: z.string().describe("Title of the task"),
                status: z.enum($Enums.Status).describe("Status of the task: TODO, IN_PROGRESS, DONE"),
            }),
        ),
    )
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Admin can filter by userId, User can only see their own tasks
        const userIdFilter = isAdmin ? input?.userId : session.user.id;

        // Get task list
        const tasks = await getTasksPageFindMany(
            {
                select: { id: true, title: true, status: true },
                orderBy: { updatedAt: input?.updatedAt },
                where: {
                    ...(input?.search && {
                        title: { contains: input?.search },
                    }),
                    userId: userIdFilter,
                },
            },
            [`getTasksPage`, `getTasksPage-${userIdFilter}`],
        );

        return tasks;
    });

export const pageRoutes = {
    tasksPage: getTasksPage,
};
