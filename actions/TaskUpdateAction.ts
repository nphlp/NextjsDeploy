"use server";

// import { taskIdPageParams } from "@app/task/[id]/components/fetch";
import { getSession } from "@lib/auth-server";
import PrismaInstance from "@lib/prisma";
import { $Enums } from "@prisma/client/client";
import { TaskModel } from "@services/types";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";
import { cacheLifeApi } from "@/solid/solid-config";
import { ActionError, ActionResponse, ClientError } from "./ActionError";

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
        if (!taskExists) throw new ClientError("Task not found");

        // Some other logic here

        // Proceed to action

        // Proceed to creation
        const updatedTask = await PrismaInstance.task.update({
            where: { id, userId },
            data: { title, status },
        });

        // Revalidate related cache tags
        // -> `/tasks` page
        revalidateTag("task-findMany", cacheLifeApi);
        revalidateTag(`getTasksPage-${userId}`, "hours");
        // -> `/task/{id}` page
        // revalidateTag(hashParamsForCacheKey("task-findUnique", taskIdPageParams(id, session)), cacheLifeApi);
        revalidateTag(`getTask-${updatedTask.id}`, "hours");

        return { data: updatedTask };
    } catch (error) {
        return ActionError(error);
    }
};
