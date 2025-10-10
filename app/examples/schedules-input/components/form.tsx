"use client";

import DropdownCalendar from "@comps/SHADCN/components/dropdown-calendar";
import Button from "@comps/UI/button/button";
import Card from "@comps/UI/card";
import { Time } from "@internationalized/date";
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

        const formatTimeToString = (time?: Time | null): string | null => {
            if (!time) return null;
            return `${time.hour}:${time.minute}`;
        };

        const selectedDaysString = selectedDays.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            isActive: day.isActive,
            morningStart: formatTimeToString(day.morningStart),
            morningEnd: formatTimeToString(day.morningEnd),
            afternoonStart: formatTimeToString(day.afternoonStart),
            afternoonEnd: formatTimeToString(day.afternoonEnd),
        }));

        const reponse = await AddWorkSchedule({ dateFrom, dateTo, selectedDays: selectedDaysString });

        console.log("reponse", reponse);

        refetch();
    };

    return (
        <Card>
            <form className="space-y-4" action={handleSubmit}>
                <div className="space-y-6">
                    <h2 className="text-foreground text-sm font-bold">Période de planification</h2>
                    <div className="flex w-full justify-between gap-4">
                        <DropdownCalendar label="Début" setDate={setDateFrom} date={dateFrom} />
                        <DropdownCalendar label="Fin (optionnelle)" setDate={setDateTo} date={dateTo} />
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
