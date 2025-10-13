"use server";

import { ContractCreateAction, ContractFindFirstAction } from "@actions/ContractAction";
import { ScheduleDeleteAction } from "@actions/ScheduleAction";
import { ScheduleCreateAction } from "@actions/ScheduleAction";
import { exampleSchedulesInputPageParams } from "@app/examples/schedules-input/components/fetch";
import { getSession } from "@lib/authServer";
import { $Enums } from "@prisma/client";
import { ScheduleModel } from "@services/types";
import { cacheLifeApi, hashParamsForCacheKey } from "@utils/FetchConfig";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";

type AddScheduleProps = {
    dateFrom: Date;
    dateTo?: Date;
    selectedDays: {
        dayOfWeek: $Enums.DayOfWeek;
        arriving: string;
        leaving: string;
    }[];
};

const addScheduleSchema: ZodType<AddScheduleProps> = z.object({
    dateFrom: z.date(),
    dateTo: z.date().optional(),
    selectedDays: z.array(
        z.object({
            dayOfWeek: z.enum($Enums.DayOfWeek),
            arriving: z.string(),
            leaving: z.string(),
        }),
    ),
});

export const AddSchedule = async (props: AddScheduleProps): Promise<ScheduleModel | null> => {
    try {
        const { dateFrom, dateTo, selectedDays } = addScheduleSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Find
        const foundContract = await ContractFindFirstAction({
            where: {
                employeeId: session.user.id,
                AND: {
                    startDate: { gte: dateFrom },
                    endDate: dateTo ? { lte: dateTo } : undefined,
                },
            },
        });

        const contract = foundContract
            ? foundContract
            : await ContractCreateAction({
                  data: {
                      employeeId: session.user.id,
                      contractType: "CDI",
                      startDate: dateFrom,
                  },
              });

        // Proceed to creation
        const workSchedule = await ScheduleCreateAction({
            data: {
                // For the connected user
                Contract: {
                    connect: {
                        id: contract.id,
                        employeeId: session.user.id,
                    },
                },
                // On the following period
                startDate: dateFrom,
                endDate: dateTo,
                // With the following work days
                Days: {
                    createMany: {
                        data: selectedDays.map(({ dayOfWeek, arriving, leaving }) => ({
                            dayOfWeek,
                            arriving,
                            leaving,
                        })),
                    },
                },
            },
            include: {
                Days: true,
            },
        });

        // Reset specific cache tags
        revalidateTag(
            hashParamsForCacheKey("user-findUnique", exampleSchedulesInputPageParams({ userId: session.user.id })),
            cacheLifeApi,
        );

        console.log("Creation succeeded", workSchedule.startDate, workSchedule.endDate);

        return workSchedule;
    } catch (error) {
        console.error("Failed to create task:", error);
        return null;
    }
};

type DeleteScheduleProps = {
    id: string;
};

const deleteScheduleSchema: ZodType<DeleteScheduleProps> = z.object({
    id: z.nanoid(),
});

export const DeleteSchedule = async (props: DeleteScheduleProps): Promise<ScheduleModel | null> => {
    try {
        const { id } = deleteScheduleSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Proceed to deletion
        const deletedSchedule = await ScheduleDeleteAction({ where: { id } });

        // Reset specific cache tags
        revalidateTag(
            hashParamsForCacheKey("user-findUnique", exampleSchedulesInputPageParams({ userId: session.user.id })),
            cacheLifeApi,
        );

        console.log("Deletion succeeded", deletedSchedule.startDate, deletedSchedule.endDate);

        return deletedSchedule;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return null;
    }
};
