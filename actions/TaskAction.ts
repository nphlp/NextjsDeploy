"use server";

import { TaskCreateAction, TaskDeleteAction, TaskFindUniqueAction, TaskUpdateAction } from "@actions/TaskAction";
import { taskIdPageParams } from "@app/task/[id]/components/fetch";
import { getSession } from "@lib/authServer";
import { $Enums } from "@prisma/client";
import { TaskModel } from "@services/types";
import { cacheLifeApi, hashParamsForCacheKey } from "@utils/FetchConfig";
import { stringToSlug } from "@utils/stringToSlug";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
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

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Check that task does not already exist
        const existingTask = await TaskFindUniqueAction({
            where: {
                title,
                authorId: session.user.id,
            },
        });
        if (existingTask) return null;

        // Generate slug
        const slug = stringToSlug(title);

        // Proceed to creation
        const createdTask = await TaskCreateAction({
            data: {
                title,
                slug,
                authorId: session.user.id,
            },
        });

        // Reset specific cache tags
        revalidateTag("task-findMany", cacheLifeApi);

        console.log("Creation succeeded", createdTask.title, createdTask.status);

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

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Check if task exists
        const existingTask = await TaskFindUniqueAction({
            where: {
                id,
                authorId: session.user.id,
            },
        });
        if (!existingTask) return null;

        // Generate slug (if title is updated)
        const slug = title ? stringToSlug(title) : undefined;

        // Proceed to update
        const updatedTask = await TaskUpdateAction({
            where: {
                id,
                authorId: session.user.id,
            },
            data: {
                title,
                slug,
                status,
            },
        });

        // Reset specific cache tags
        revalidateTag("task-findMany", cacheLifeApi);
        revalidateTag(hashParamsForCacheKey("task-findUnique", taskIdPageParams(id, session)), cacheLifeApi);

        console.log("Update succeeded", updatedTask.title, updatedTask.status);

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

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Check if task exists
        const existingTask = await TaskFindUniqueAction({
            where: {
                id,
                authorId: session.user.id,
            },
        });
        if (!existingTask) return null;

        // Proceed to deletion
        const deletedTask = await TaskDeleteAction({
            where: {
                id,
                authorId: session.user.id,
            },
        });

        // Reset specific cache tags
        revalidateTag("task-findMany", cacheLifeApi);
        revalidateTag(hashParamsForCacheKey("task-findUnique", taskIdPageParams(id, session)), cacheLifeApi);

        console.log("Deletion succeeded", deletedTask.title, deletedTask.status);

        return deletedTask;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return null;
    }
};
