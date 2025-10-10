"use client";

import { WorkScheduleCreateAction } from "@actions/WorkScheduleAction";
import DropdownCalendar from "@comps/SHADCN/components/dropdown-calendar";
import Button from "@comps/UI/button/button";
import Card from "@comps/UI/card";
import { Time } from "@internationalized/date";
import { Session } from "@lib/authServer";
import { useContext, useState } from "react";
import { Context } from "./context";
import DaySelector from "./day-selector";
import useSchedule from "./states";

type FormProps = {
    sessionServer: NonNullable<Session>;
};

export default function Form(props: FormProps) {
    const { sessionServer } = props;

    const { refetch } = useContext(Context);

    const [datefrom, setDateFrom] = useState<Date | undefined>(new Date());
    const [dateto, setDateTo] = useState<Date | undefined>(undefined);

    const { selectedDays, setSelectedDays } = useSchedule();

    const formatTimeToString = (time?: Time | null): string | undefined => {
        if (!time) return undefined;
        return `${time.hour}:${time.minute}`;
    };

    const handleSubmit = async () => {
        if (!datefrom) return console.log("Please select a start date");

        const reponse = await WorkScheduleCreateAction({
            data: {
                // For the connected user
                employeeId: sessionServer.user.id,
                // On the following period
                startDate: datefrom,
                endDate: dateto,
                // With the following work days
                WorkDays: {
                    createMany: {
                        data: selectedDays.map((day) => ({
                            isWorking: true, // TODO: remove this ! Useless no ?
                            dayOfWeek: day.dayOfWeek,
                            morningStart: formatTimeToString(day.morningStart),
                            morningEnd: formatTimeToString(day.morningEnd),
                            afternoonStart: formatTimeToString(day.afternoonStart),
                            afternoonEnd: formatTimeToString(day.afternoonEnd),
                        })),
                    },
                },
            },
            include: {
                WorkDays: true,
            },
        });

        console.log("reponse", reponse);

        refetch();
    };

    return (
        <Card>
            <form className="space-y-4" action={handleSubmit}>
                <div className="space-y-6">
                    <h2 className="text-foreground text-sm font-bold">Période de planification</h2>
                    <div className="flex w-full justify-between gap-4">
                        <DropdownCalendar label="Début" setDate={setDateFrom} date={datefrom} />
                        <DropdownCalendar label="Fin (optionnelle)" setDate={setDateTo} date={dateto} />
                    </div>
                </div>
                <hr />
                <DaySelector setSelectedDays={setSelectedDays} selectedDays={selectedDays} />
                <hr />
                <div className="flex justify-center">
                    <Button type="submit" label="Enregistrer" />
                </div>
            </form>
        </Card>
    );
}
