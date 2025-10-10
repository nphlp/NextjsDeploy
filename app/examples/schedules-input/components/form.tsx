"use client";

import DropdownCalendar from "@comps/SHADCN/components/dropdown-calendar";
import Button from "@comps/UI/button/button";
import Card from "@comps/UI/card";
import { Time } from "@internationalized/date";
import { $Enums } from "@prisma/client";
import { useContext, useState } from "react";
import { AddWorkSchedule } from "@/actions/WorkScheduleAction";
import { Context } from "./context";
import DaySelector from "./day-selector";
import useSchedule from "./states";

export default function Form() {
    const { refetch } = useContext(Context);

    const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

    const { selectedDays, setSelectedDays } = useSchedule();

    const handleSubmit = async () => {
        if (!dateFrom) return console.log("Please select a start date");

        const formatTimeToString = (time: Time): string => `${time.hour}:${time.minute}`;

        const selectedDaysString: { dayOfWeek: $Enums.DayOfWeek; arriving: string; leaving: string }[] = selectedDays
            .map((day) => {
                if (!day.isActive || !day.arriving || !day.leaving) return null;
                return {
                    dayOfWeek: day.dayOfWeek,
                    arriving: formatTimeToString(day.arriving),
                    leaving: formatTimeToString(day.leaving),
                };
            })
            .filter((day) => day !== null);

        const response = await AddWorkSchedule({ dateFrom, dateTo, selectedDays: selectedDaysString });

        console.log("response", response);

        refetch();
    };

    return (
        <Card>
            <form className="space-y-4" action={handleSubmit}>
                <div className="space-y-6">
                    <h2 className="text-foreground text-sm font-bold">Période de planification</h2>
                    <div className="flex w-full justify-between gap-4">
                        <DropdownCalendar label="Début" setDate={setDateFrom} date={dateFrom} />
                        <DropdownCalendar label="Fin" setDate={setDateTo} date={dateTo} optional />
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
