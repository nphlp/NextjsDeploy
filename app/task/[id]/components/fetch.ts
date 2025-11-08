import { Session } from "@lib/auth-server";
import { TaskFindUniqueProps, TaskFindUniqueResponse } from "@services/types";

export const taskIdPageParams = (id: string, session: NonNullable<Session>) =>
    ({
        select: { id: true, title: true, status: true, updatedAt: true },
        where: {
            id,
            userId: session.user.id,
        },
    }) satisfies TaskFindUniqueProps;

export type TaskTypeNullable = TaskFindUniqueResponse<ReturnType<typeof taskIdPageParams>>;

export type TaskType = NonNullable<TaskTypeNullable>;
