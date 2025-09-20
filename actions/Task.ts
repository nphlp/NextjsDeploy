"use server";

import { TaskCreateAction, TaskDeleteAction, TaskFindUniqueAction, TaskUpdateAction } from "@actions/TaskAction";
import { $Enums } from "@prisma/client";
import { hashParamsForCacheKey } from "@utils/FetchConfig";
import { stringToSlug } from "@utils/stringToSlug";
import { revalidateTag } from "next/cache";

export const AddTask = async (title: string) => {
    try {
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

export const UpdateTask = async (id: string, title: string, status: $Enums.Status) => {
    try {
        const existingTask = await TaskFindUniqueAction({ where: { id } });
        if (!existingTask) return;

        const updatedTask = await TaskUpdateAction({
            where: { id },
            data: {
                title,
                slug: stringToSlug(title),
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

export const DeleteTask = async (id: string) => {
    try {
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
