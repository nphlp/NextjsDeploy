import { TaskFindUniqueProps, TaskFindUniqueResponse } from "@services/types";

export const taskIdPageParams = (id: string) =>
    ({
        select: { id: true, title: true, status: true },
        where: { id },
    }) satisfies TaskFindUniqueProps;

export type TaskType = TaskFindUniqueResponse<ReturnType<typeof taskIdPageParams>>;
