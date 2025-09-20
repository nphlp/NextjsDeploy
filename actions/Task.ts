"use server";

import { TaskCreateAction, TaskDeleteAction, TaskFindUniqueAction, TaskUpdateAction } from "@actions/TaskAction";
import { $Enums } from "@prisma/client";
import { hashParamsForCacheKey } from "@utils/FetchConfig";
import { stringToSlug } from "@utils/stringToSlug";
import { revalidateTag } from "next/cache";
import z, { ZodType } from "zod";

type AddTaskProps = {
    title: string;
};

const addTaskSchema: ZodType<AddTaskProps> = z.object({
    title: z.string().min(2).max(100),
});

export const AddTask = async (props: AddTaskProps) => {
    try {
        const { title } = addTaskSchema.parse(props);

        const existingTask = await TaskFindUniqueAction({ where: { title } });
        if (existingTask) return;

        const createdTask = await TaskCreateAction({
            data: {
                title,
                slug: stringToSlug(title),
                Author: {
                    connect: {
                        email: "user@example.com",
                    },
                },
            },
        });

        console.log("Task created:", createdTask);

        revalidateTag(hashParamsForCacheKey("task-findMany", { orderBy: { updatedAt: "desc" } }));
        // revalidateTag("task-findMany");

        return createdTask;
    } catch (error) {
        console.error("Failed to create task:", error);
        return undefined;
    }
};

type UpdateTaskProps = {
    id: string;
    title?: string;
    status?: string;
};

type UpdateTaskParsedProps = UpdateTaskProps & {
    status?: $Enums.Status;
};

const updateTaskSchema: ZodType<UpdateTaskParsedProps> = z.object({
    id: z.nanoid(),
    title: z.string().min(2).max(100).optional(),
    status: z.enum($Enums.Status).optional(),
});

export const UpdateTask = async (props: UpdateTaskProps) => {
    try {
        const { id, title, status } = updateTaskSchema.parse(props);

        console.log("Updating task:", { id, title, status });

        const existingTask = await TaskFindUniqueAction({ where: { id } });
        if (!existingTask) return;

        const slug = title ? stringToSlug(title) : undefined;

        const updatedTask = await TaskUpdateAction({
            where: { id },
            data: {
                title,
                slug,
                status,
            },
        });

        console.log("Task updated:", updatedTask);

        revalidateTag(hashParamsForCacheKey("task-findMany", { orderBy: { updatedAt: "desc" } }));
        // revalidateTag("task-findMany");

        return updatedTask;
    } catch (error) {
        console.error("Failed to update task:", error);
        return undefined;
    }
};

type DeleteTaskProps = {
    id: string;
};

const deleteTaskSchema: ZodType<DeleteTaskProps> = z.object({
    id: z.nanoid(),
});

export const DeleteTask = async (props: DeleteTaskProps) => {
    try {
        const { id } = deleteTaskSchema.parse(props);

        const existingTask = await TaskFindUniqueAction({ where: { id } });
        if (!existingTask) return;

        const deletedTask = await TaskDeleteAction({
            where: { id },
        });

        console.log("Task deleted:", deletedTask);

        revalidateTag(hashParamsForCacheKey("task-findMany", { orderBy: { updatedAt: "desc" } }));
        // revalidateTag("task-findMany");

        return deletedTask;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return undefined;
    }
};
