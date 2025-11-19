"use server";

import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { $Enums } from "@prisma/client/client";
import { formatStringArrayLineByLine } from "@utils/string-format";
import { revalidatePath, revalidateTag } from "next/cache";
import { notFound, unauthorized } from "next/navigation";
import "server-only";
import { z } from "zod";
import { taskOutputSchema } from "./task-schema";

export const create = os
    .route({
        method: "POST",
        path: "/tasks",
        summary: "TASK Create",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Create task for any user",
            "- **User**",
            "  - [ ] Create task for himself only",
            "**Cache revalidation**",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
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
            revalidateTags: z.array(z.string()).optional().describe("Array of revalidation tags"),
            revalidatePaths: z.array(z.string()).optional().describe("Array of revalidation paths"),
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
        revalidateTag(`taskFindManyCached`, "hours");
        revalidateTag(`taskFindManyCached-${userIdOwner}`, "hours");

        // Provided revalidation tags and paths
        input.revalidateTags?.map((tag) => revalidateTag(tag, "hours"));
        input.revalidatePaths?.map((path) => revalidatePath(path));

        return task;
    })
    .actionable();

export const update = os
    .route({
        method: "PUT",
        path: "/tasks/{id}",
        summary: "TASK Update",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Update task of any user",
            "- **User**",
            "  - [ ] Update task of himself only",
            "**Cache revalidation**",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
            title: z.string().min(1, "Title cannot be empty").optional().describe("Task title"),
            status: z.enum($Enums.Status).optional().describe("Task status"),
            revalidateTags: z.array(z.string()).optional().describe("Array of revalidation tags"),
            revalidatePaths: z.array(z.string()).optional().describe("Array of revalidation paths"),
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
        revalidateTag(`taskFindManyCached`, "hours");
        revalidateTag(`taskFindManyCached-${taskExists.userId}`, "hours");
        revalidateTag(`taskFindUniqueCached-${input.id}`, "hours");

        // Provided revalidation tags and paths
        input.revalidateTags?.map((tag) => revalidateTag(tag, "hours"));
        input.revalidatePaths?.map((path) => revalidatePath(path));

        return task;
    })
    .actionable();

export const deleting = os
    .route({
        method: "DELETE",
        path: "/tasks/{id}",
        summary: "TASK Delete",
        description: formatStringArrayLineByLine([
            "**Permissions**",
            "- **Admin**",
            "  - [ ] Delete task of any user",
            "- **User**",
            "  - [ ] Delete task of himself only",
            "**Cache revalidation**",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
            revalidateTags: z.array(z.string()).optional().describe("Array of revalidation tags"),
            revalidatePaths: z.array(z.string()).optional().describe("Array of revalidation paths"),
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
        revalidateTag(`taskFindManyCached`, "hours");
        revalidateTag(`taskFindManyCached-${taskExists.userId}`, "hours");
        revalidateTag(`taskFindUniqueCached-${input.id}`, "hours");

        // Provided revalidation tags and paths
        input.revalidateTags?.map((tag) => revalidateTag(tag, "hours"));
        input.revalidatePaths?.map((path) => revalidatePath(path));

        return task;
    })
    .actionable();

const taskMutations = () => ({
    create,
    update,
    delete: deleting,
});

export default taskMutations;
