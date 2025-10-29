import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";
import { TaskQueryParamsCachedType } from "./queryParams";

export const taskPageParams = ({ updatedAt, search, userId }: TaskQueryParamsCachedType & { userId: string }) =>
    ({
        select: { id: true, title: true, status: true },
        orderBy: { updatedAt },
        where: {
            ...(search && {
                title: { contains: search },
            }),
            userId,
        },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof taskPageParams>>[number];
