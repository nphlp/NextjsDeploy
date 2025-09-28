import { TaskFindUniqueProps, TaskFindUniqueResponse } from "@services/types";

export const taskIdPageParams = (id: string) =>
    ({
        select: { id: true, title: true, status: true },
        where: { id },
    }) satisfies TaskFindUniqueProps;

export type TaskTypeNullable = TaskFindUniqueResponse<ReturnType<typeof taskIdPageParams>>;

export type TaskType = NonNullable<TaskTypeNullable>;
