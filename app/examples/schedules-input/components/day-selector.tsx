"use client";

import { Dispatch, SetStateAction } from "react";
import InputSchedules from "./input-schedules";
import { WorkDayTemplate } from "./states";

type DaySelectorProps = {
    setSelectedDays: Dispatch<SetStateAction<WorkDayTemplate>>[];
    selectedDays: WorkDayTemplate[];
};

export default function DaySelector(props: DaySelectorProps) {
    const { setSelectedDays, selectedDays } = props;

    return (
        <div className="space-y-6">
            <h2 className="text-foreground text-sm font-bold">Jours de travail</h2>
            <div className="space-y-6">
                {selectedDays.map((selectedDay, index) => (
                    <InputSchedules key={index} setSelectedDay={setSelectedDays[index]} selectedDay={selectedDay} />
                ))}
            </div>
        </div>
    );
}
