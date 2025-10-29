"use server";

import { taskIdPageParams } from "@app/task/[id]/components/fetch";
import { getSession } from "@lib/authServer";
import PrismaInstance from "@lib/prisma";
import { $Enums } from "@prisma/client";
import { TaskModel } from "@services/types";
import { cacheLifeApi, hashParamsForCacheKey } from "@utils/FetchConfig";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";
import { ActionResponse } from "./types";

type TaskUpdateActionProps = {
    id: string;
    title?: string;
    status?: string;
};

type TaskUpdateActionParsedProps = TaskUpdateActionProps & {
    status?: $Enums.Status;
};

const taskUpdateActionSchema: ZodType<TaskUpdateActionParsedProps> = z.object({
    id: z.string(),
    title: z.string().min(2).max(100).optional(),
    status: z.enum($Enums.Status).optional(),
});

type TaskUpdateActionResponse = ActionResponse<TaskModel | null>;

export const TaskUpdateAction = async (props: TaskUpdateActionProps): Promise<TaskUpdateActionResponse> => {
    try {
        // Validate input
        const { id, title, status } = taskUpdateActionSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized(); // Not logged in

        // Check permission / role / ownership
        const userId = session.user.id;

        // Check related existencies in database
        const taskExists = await PrismaInstance.task.findUnique({
            where: { id, userId },
        });
        if (!taskExists) throw new Error("Task not found");

        // Some other logic here

        // Proceed to action

        // Proceed to creation
        const updatedTask = await PrismaInstance.task.update({
            where: { id, userId },
            data: { title, status },
        });

        // Revalidate related cache tags
        revalidateTag("task-findMany", cacheLifeApi);
        revalidateTag(hashParamsForCacheKey("task-findUnique", taskIdPageParams(id, session)), cacheLifeApi);

        return { data: updatedTask };
    } catch (error) {
        const expliciteErrorMessage = (error as Error).message;

        // Server logging
        console.error("TaskUpdateAction -> ", expliciteErrorMessage, "\n\nRaw error:\n\n", error);

        // Client logging
        const isDev = process.env.NODE_ENV === "development";
        return { error: isDev ? expliciteErrorMessage : "Something went wrong" };
    }
};
