import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";

export const tasksParams = () =>
    ({
        select: { id: true, title: true, status: true },
        orderBy: { updatedAt: "desc" },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof tasksParams>>[number];
