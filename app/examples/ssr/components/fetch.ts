import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";
import { ExampleSrrQueryParamsCachedType } from "./queryParams";

export const exampleSrrPageParams = ({ updatedAt, search }: ExampleSrrQueryParamsCachedType) =>
    ({
        select: { id: true, title: true, status: true },
        orderBy: { updatedAt },
        where: {
            ...(search && {
                OR: [{ title: { contains: search } }, { slug: { contains: search } }],
            }),
        },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof exampleSrrPageParams>>[number];
