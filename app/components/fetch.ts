import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";
import { HomeQueryParamsCachedType } from "./queryParams";

export const homePageParams = ({ updatedAt, search }: HomeQueryParamsCachedType) =>
    ({
        select: { id: true, title: true, status: true },
        orderBy: { updatedAt },
        where: {
            ...(search && {
                OR: [{ title: { contains: search } }, { slug: { contains: search } }],
            }),
        },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof homePageParams>>[number];
