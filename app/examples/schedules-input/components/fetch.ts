import { UserFindManyProps, UserFindManyResponse } from "@services/types";

export const exampleSchedulesInputPageParams = ({ userId }: { userId: string }) =>
    ({
        include: {
            Contracts: {
                include: {
                    Schedules: {
                        include: {
                            Days: true,
                        },
                    },
                },
            },
        },
        where: { id: userId },
    }) satisfies UserFindManyProps;

export type UserType = UserFindManyResponse<ReturnType<typeof exampleSchedulesInputPageParams>>[number];
