"use server";

import { tag } from "@cache/api-utils";
import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { os } from "@orpc/server";
import { $Enums } from "@prisma/client/client";
import { formatStringArrayLineByLine } from "@utils/string-format";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
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
            "  - [ ] Update specific tags after mutation",
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
            updateTags: z.array(z.string()).optional().describe("Array of update tags"),
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

        // Update cache
        updateTag(tag("task", "findMany"));
        updateTag(tag("task", "findMany", userIdOwner));

        // Provided revalidation tags and paths
        input.updateTags?.map((t) => updateTag(t));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

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
            "  - [ ] Update specific tags after mutation",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
            title: z.string().min(1, "Title cannot be empty").optional().describe("Task title"),
            status: z.enum($Enums.Status).optional().describe("Task status"),
            updateTags: z.array(z.string()).optional().describe("Array of update tags"),
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

        // Update cache
        updateTag(tag("task", "findMany"));
        updateTag(tag("task", "findMany", taskExists.userId));
        updateTag(tag("task", "findUnique", input.id));

        // Provided revalidation tags and paths
        input.updateTags?.map((t) => updateTag(t));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

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
            "  - [ ] Update specific tags after mutation",
            "  - [ ] Revalidate specific tags after mutation",
            "  - [ ] Revalidate specific paths after mutation",
        ]),
    })
    .input(
        z.object({
            id: z.string().describe("Task ID"),
            updateTags: z.array(z.string()).optional().describe("Array of update tags"),
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

        // Update cache
        updateTag(tag("task", "findMany"));
        updateTag(tag("task", "findMany", taskExists.userId));
        updateTag(tag("task", "findUnique", input.id));

        // Provided revalidation tags and paths
        input.updateTags?.map((t) => updateTag(t));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return task;
    })
    .actionable();

const taskMutations = async () => ({
    create,
    update,
    delete: deleting,
});

export default taskMutations;
