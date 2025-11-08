"use server";

import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { TaskModel } from "@services/types";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";
import { cacheLifeApi } from "@/solid/solid-config";
import { ActionError, ActionResponse } from "./ActionError";

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
        return ActionError(error);
    }
};
