import { getSession } from "@lib/authServer";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { $Enums, Prisma, Task } from "@prisma/client";
import { formatStringArrayLineByLine } from "@utils/string-format";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { notFound, unauthorized } from "next/navigation";
import "server-only";
import { ZodType, z } from "zod";

const taskOutputSchema: ZodType<Task> = z.object({
    id: z.string().describe("Unique ID of the task (nanoid)"),
    title: z.string().describe("Title of the task"),
    status: z.enum($Enums.Status).describe("Status of the task: TODO, IN_PROGRESS, DONE"),
    userId: z.string().describe("Unique ID of the user who owns the task"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});

const getTaskListFindMany = async (props: Prisma.TaskFindManyArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.task.findMany(props);
};

const getTaskList = os
    .route({
        method: "GET",
        path: "/tasks",
        summary: "Get tasks",
        description: formatStringArrayLineByLine([
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
                take: z.number().min(1).max(1000).optional().describe("Number of tasks to take"),
                skip: z.number().min(0).optional().describe("Number of tasks to skip"),
                userId: z.string().optional().describe("Filter by user ID (admin right)"),
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
        const tasks = await getTaskListFindMany(
            {
                take: input?.take,
                skip: input?.skip,
                where: { userId: userIdFilter },
            },
            [`getTaskList`, `getTaskList-${userIdFilter}`],
        );

        return tasks;
    });

const getTaskFindUnique = async (props: Prisma.TaskFindUniqueArgs, key: string[]) => {
    "use cache";
    cacheTag(...key);
    cacheLife("hours");
    return await PrismaInstance.task.findUnique(props);
};

const getTask = os
    .route({
        method: "GET",
        path: "/tasks/{id}",
        summary: "Get a task by ID",
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
        const task = await getTaskFindUnique({ where: { id: input.id } }, [`getTask-${input.id}`]);
        if (!task) notFound();

        // Check if user session is authorized to access this task
        const isAuthorized = isAdmin || task.userId === session.user.id;
        if (!isAuthorized) unauthorized();

        return task;
    });

const createTask = os
    .route({
        method: "POST",
        path: "/tasks",
        summary: "Create a new task",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Create task for any user",
            "- **User**",
            "  - [ ] Create task for himself only",
        ]),
    })
    .input(
        z.object({
            title: z.string().min(1, "Title is required").describe("Task title"),
            status: z
                .enum($Enums.Status)
                .optional()
                .default("TODO")
                .describe("Task status : TODO (default), IN_PROGRESS, DONE"),
            userId: z.string().optional().describe("User ID owner of the task (admin right)"),
        }),
    )
    .output(taskOutputSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Admin can create tasks for any user, User creates for themselves
        const userIdOwner = isAdmin ? (input.userId ?? session.user.id) : session.user.id;

        // Create the task
        const task = await PrismaInstance.task.create({
            data: {
                title: input.title,
                status: input.status,
                userId: userIdOwner,
            },
        });

        // Revalidate cache
        revalidateTag(`getTaskList`, "hours");
        revalidateTag(`getTaskList-${userIdOwner}`, "hours");

        return task;
    });

const updateTask = os
    .route({
        method: "PUT",
        path: "/tasks/{id}",
        summary: "Update a task",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Update task of any user",
            "- **User**",
            "  - [ ] Update task of himself only",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
            title: z.string().min(1, "Title cannot be empty").optional().describe("Task title"),
            status: z.enum($Enums.Status).optional().describe("Task status"),
        }),
    )
    .output(taskOutputSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if task exists
        const taskExists = await PrismaInstance.task.findUnique({ where: { id: input.id } });
        if (!taskExists) notFound();

        // Check if user session is authorized to mutate this task
        const isAuthorized = isAdmin || taskExists.userId === session.user.id;
        if (!isAuthorized) unauthorized();

        // Update the task
        const task = await PrismaInstance.task.update({
            data: {
                title: input.title,
                status: input.status,
            },
            where: { id: input.id },
        });

        // Revalidate cache
        revalidateTag(`getTaskList`, "hours");
        revalidateTag(`getTaskList-${taskExists.userId}`, "hours");
        revalidateTag(`getTask-${input.id}`, "hours");

        return task;
    });

const deleteTask = os
    .route({
        method: "DELETE",
        path: "/tasks/{id}",
        summary: "Delete a task",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Delete task of any user",
            "- **User**",
            "  - [ ] Delete task of himself only",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
        }),
    )
    .output(taskOutputSchema)
    .handler(async ({ input }) => {
        const session = await getSession();
        if (!session) unauthorized();

        const isAdmin = session.user.role === "ADMIN";

        // Check if task exists
        const taskExists = await PrismaInstance.task.findUnique({ where: { id: input.id } });
        if (!taskExists) notFound();

        // Check if user session is authorized to delete this task
        const isAuthorized = isAdmin || taskExists.userId === session.user.id;
        if (!isAuthorized) unauthorized();

        // Delete the task
        const task = await PrismaInstance.task.delete({ where: { id: input.id } });

        // Revalidate cache
        revalidateTag(`getTaskList`, "hours");
        revalidateTag(`getTaskList-${taskExists.userId}`, "hours");
        revalidateTag(`getTask-${input.id}`, "hours");

        return task;
    });

export const taskRoutes = {
    list: getTaskList,
    get: getTask,
    create: createTask,
    update: updateTask,
    delete: deleteTask,
};
