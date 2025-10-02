import { TaskFindManyProps, TaskFindManyResponse } from "@services/types";

export const exampleBouncyHeightResizerPageParams = () =>
    ({
        select: { id: true, title: true },
    }) satisfies TaskFindManyProps;

export type TaskType = TaskFindManyResponse<ReturnType<typeof exampleBouncyHeightResizerPageParams>>[number];
