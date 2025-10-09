import { Session } from "@lib/authServer";
import { TaskFindUniqueProps, TaskFindUniqueResponse } from "@services/types";

export const taskIdPageParams = (id: string, session: NonNullable<Session>) =>
    ({
        select: { id: true, title: true, status: true, updatedAt: true },
        where: {
            id,
            authorId: session.user.id,
        },
    }) satisfies TaskFindUniqueProps;

export type TaskTypeNullable = TaskFindUniqueResponse<ReturnType<typeof taskIdPageParams>>;

export type TaskType = NonNullable<TaskTypeNullable>;
