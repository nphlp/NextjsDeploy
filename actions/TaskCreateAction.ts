"use server";

import { getSession } from "@lib/authServer";
import PrismaInstance from "@lib/prisma";
import { TaskModel } from "@services/types";
import { cacheLifeApi } from "@utils/FetchConfig";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";
import { ActionResponse } from "./ActionError";

type TaskCreateActionProps = {
    title: string;
};

const taskCreateActionSchema: ZodType<TaskCreateActionProps> = z.object({
    title: z.string().min(2).max(100),
});

type TaskCreateActionResponse = ActionResponse<TaskModel | null>;

export const TaskCreateAction = async (props: TaskCreateActionProps): Promise<TaskCreateActionResponse> => {
    try {
        // Validate input
        const { title } = taskCreateActionSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized(); // Not logged in

        // Check permission / role / ownership
        const userId = session.user.id;

        // Check related existencies in database

        // Some other logic here

        // Proceed to action

        // Proceed to creation
        const createdTask = await PrismaInstance.task.create({
            data: { title, status: "TODO", userId },
        });

        // Revalidate related cache tags
        revalidateTag("task-findMany", cacheLifeApi);

        return { data: createdTask };
    } catch (error) {
        const expliciteErrorMessage = (error as Error).message;

        // Server logging
        console.error("TaskCreateAction -> ", expliciteErrorMessage, "\n\nRaw error:\n\n", error);

        // Client logging
        const isDev = process.env.NODE_ENV === "development";
        return { error: isDev ? expliciteErrorMessage : "Something went wrong" };
    }
};
