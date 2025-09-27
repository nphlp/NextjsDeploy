"use server";

import { TaskCreateAction, TaskDeleteAction, TaskFindUniqueAction, TaskUpdateAction } from "@actions/TaskAction";
import { $Enums } from "@prisma/client";
import { TaskModel } from "@services/types";
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

export const AddTask = async (props: AddTaskProps): Promise<TaskModel | null> => {
    try {
        const { title } = addTaskSchema.parse(props);

        const existingTask = await TaskFindUniqueAction({ where: { title } });
        if (existingTask) return null;

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

        revalidateTag(hashParamsForCacheKey("task-findMany", { orderBy: { updatedAt: "desc" } }));

        return createdTask;
    } catch (error) {
        console.error("Failed to create task:", error);
        return null;
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
    id: z.string(),
    title: z.string().min(2).max(100).optional(),
    status: z.enum($Enums.Status).optional(),
});

export const UpdateTask = async (props: UpdateTaskProps): Promise<TaskModel | null> => {
    try {
        const { id, title, status } = updateTaskSchema.parse(props);

        const existingTask = await TaskFindUniqueAction({ where: { id } });
        if (!existingTask) return null;

        const slug = title ? stringToSlug(title) : undefined;

        const updatedTask = await TaskUpdateAction({
            where: { id },
            data: {
                title,
                slug,
                status,
            },
        });

        revalidateTag(hashParamsForCacheKey("task-findMany", { orderBy: { updatedAt: "desc" } }));
        revalidateTag(hashParamsForCacheKey("task-findUnique", { where: { id } }));

        return updatedTask;
    } catch (error) {
        console.error("Failed to update task:", error);
        return null;
    }
};

type DeleteTaskProps = {
    id: string;
};

const deleteTaskSchema: ZodType<DeleteTaskProps> = z.object({
    id: z.nanoid(),
});

export const DeleteTask = async (props: DeleteTaskProps): Promise<TaskModel | null> => {
    try {
        const { id } = deleteTaskSchema.parse(props);

        const existingTask = await TaskFindUniqueAction({ where: { id } });
        if (!existingTask) return null;

        const deletedTask = await TaskDeleteAction({
            where: { id },
        });

        revalidateTag(hashParamsForCacheKey("task-findMany", { orderBy: { updatedAt: "desc" } }));

        return deletedTask;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return null;
    }
};
