"use server";

import { ContractCreateAction, ContractFindFirstAction } from "@actions/ContractAction";
import { WorkScheduleDeleteAction } from "@actions/WorkScheduleAction";
import { WorkScheduleCreateAction } from "@actions/WorkScheduleAction";
import { exampleSchedulesInputPageParams } from "@app/examples/schedules-input/components/fetch";
import { getSession } from "@lib/authServer";
import { $Enums } from "@prisma/client";
import { WorkScheduleModel } from "@services/types";
import { hashParamsForCacheKey } from "@utils/FetchConfig";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";

type AddWorkScheduleProps = {
    dateFrom: Date;
    dateTo?: Date;
    selectedDays: {
        dayOfWeek: $Enums.DayOfWeek;
        arriving: string;
        leaving: string;
    }[];
};

const addWorkScheduleSchema: ZodType<AddWorkScheduleProps> = z.object({
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

export const AddWorkSchedule = async (props: AddWorkScheduleProps): Promise<WorkScheduleModel | null> => {
    try {
        const { dateFrom, dateTo, selectedDays } = addWorkScheduleSchema.parse(props);

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
        const workSchedule = await WorkScheduleCreateAction({
            data: {
                // For the connected user
                employeeId: session.user.id,
                contractId: contract.id,
                // On the following period
                startDate: dateFrom,
                endDate: dateTo,
                // With the following work days
                WorkDays: {
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
                WorkDays: true,
            },
        });

        // Reset specific cache tags
        revalidateTag(
            hashParamsForCacheKey("user-findUnique", exampleSchedulesInputPageParams({ userId: session.user.id })),
        );

        console.log("Creation succeeded", workSchedule.startDate, workSchedule.endDate);

        return workSchedule;
    } catch (error) {
        console.error("Failed to create task:", error);
        return null;
    }
};

type DeleteWorkScheduleProps = {
    id: string;
};

const deleteWorkScheduleSchema: ZodType<DeleteWorkScheduleProps> = z.object({
    id: z.nanoid(),
});

export const DeleteWorkSchedule = async (props: DeleteWorkScheduleProps): Promise<WorkScheduleModel | null> => {
    try {
        const { id } = deleteWorkScheduleSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Proceed to deletion
        const deletedWorkSchedule = await WorkScheduleDeleteAction({ where: { id } });

        // Reset specific cache tags
        revalidateTag(
            hashParamsForCacheKey("user-findUnique", exampleSchedulesInputPageParams({ userId: session.user.id })),
        );

        console.log("Deletion succeeded", deletedWorkSchedule.startDate, deletedWorkSchedule.endDate);

        return deletedWorkSchedule;
    } catch (error) {
        console.error("Failed to delete task:", error);
        return null;
    }
};
