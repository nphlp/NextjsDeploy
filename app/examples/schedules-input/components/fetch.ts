import { UserFindManyProps, UserFindManyResponse } from "@services/types";

export const exampleSchedulesInputPageParams = ({ userId }: { userId: string }) =>
    ({
        include: { Schedules: true },
        where: { id: userId },
    }) satisfies UserFindManyProps;

export type UserType = UserFindManyResponse<ReturnType<typeof exampleSchedulesInputPageParams>>[number];
