import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";

export const homePageParams = () =>
    ({
        select: { id: true, title: true, status: true },
        orderBy: { updatedAt: "desc" },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof homePageParams>>[number];
