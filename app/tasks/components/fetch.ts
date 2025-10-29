import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";
import { TaskQueryParamsCachedType } from "./queryParams";

export const taskPageParams = ({ updatedAt, search, authorId }: TaskQueryParamsCachedType & { authorId: string }) =>
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

export type TaskType = TaskFindManyResponse<ReturnType<typeof taskPageParams>>[number];
