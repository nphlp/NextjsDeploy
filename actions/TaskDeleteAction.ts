"use server";

import { taskIdPageParams } from "@app/task/[id]/components/fetch";
import { getSession } from "@lib/authServer";
import PrismaInstance from "@lib/prisma";
import { TaskModel } from "@services/types";
import { cacheLifeApi, hashParamsForCacheKey } from "@utils/FetchConfig";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";
import { ActionError, ActionResponse, ClientError } from "./ActionError";

type TaskDeleteActionProps = {
    id: string;
};

const taskDeleteActionSchema: ZodType<TaskDeleteActionProps> = z.object({
    id: z.nanoid(),
});

type TaskDeleteActionResponse = ActionResponse<TaskModel | null>;

export const TaskDeleteAction = async (props: TaskDeleteActionProps): Promise<TaskDeleteActionResponse> => {
    try {
        // Validate input
        const { id } = taskDeleteActionSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized(); // Not logged in

        // Check permission / role / ownership
        const userId = session.user.id;

        // Check related existencies in database
        const taskExists = await PrismaInstance.task.findFirst({
            where: { id, userId },
        });
        if (!taskExists) throw new ClientError("Task not found");

        // Some other logic here

        // Proceed to action

        // Proceed to creation
        const deletedTask = await PrismaInstance.task.delete({
            where: { id, userId },
        });

        // Reset specific cache tags
        revalidateTag("task-findMany", cacheLifeApi);
        revalidateTag(hashParamsForCacheKey("task-findUnique", taskIdPageParams(id, session)), cacheLifeApi);

        return { data: deletedTask };
    } catch (error) {
        return ActionError(error);
    }
};
