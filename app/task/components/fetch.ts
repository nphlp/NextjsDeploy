import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";
import { HomeQueryParamsCachedType } from "./queryParams";

export const homePageParams = ({ updatedAt, search, authorId }: HomeQueryParamsCachedType & { authorId: string }) =>
    ({
        select: { id: true, title: true, status: true },
        orderBy: { updatedAt },
        where: {
            ...(search && {
                OR: [{ title: { contains: search } }, { slug: { contains: search } }],
            }),
            authorId,
        },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof homePageParams>>[number];
