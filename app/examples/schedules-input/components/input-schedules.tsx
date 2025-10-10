"use client";

import RangeTimeInput from "@comps/SHADCN/components/time-input";
import { Time } from "@internationalized/date";
import { $Enums, DayOfWeek } from "@prisma/client";
import { Label } from "@shadcn/ui/label";
import { Switch } from "@shadcn/ui/switch";
import { Dispatch, SetStateAction } from "react";

export type WorkDayTemplate = {
    dayOfWeek: $Enums.DayOfWeek;
    isActive: boolean;
    morningStart: Time | null;
    morningEnd: Time | null;
    afternoonStart: Time | null;
    afternoonEnd: Time | null;
};

type InputSchedulesProps = {
    setSelectedDay: Dispatch<SetStateAction<WorkDayTemplate>>;
    selectedDay: WorkDayTemplate;
};

export default function InputSchedules(props: InputSchedulesProps) {
    const { setSelectedDay, selectedDay } = props;

    const translate = (day: $Enums.DayOfWeek): string => {
        switch (day) {
            case DayOfWeek.MONDAY:
                return "Lundi";
            case DayOfWeek.TUESDAY:
                return "Mardi";
            case DayOfWeek.WEDNESDAY:
                return "Mercredi";
            case DayOfWeek.THURSDAY:
                return "Jeudi";
            case DayOfWeek.FRIDAY:
                return "Vendredi";
            case DayOfWeek.SATURDAY:
                return "Samedi";
            case DayOfWeek.SUNDAY:
                return "Dimanche";
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-gray-middle text-sm font-bold">{translate(selectedDay.dayOfWeek)}</h3>
                <div className="flex items-center gap-2">
                    <Label htmlFor={`switch-${selectedDay.dayOfWeek}`} className="sr-only">
                        {selectedDay.isActive ? "Actif" : "Inactif"}
                    </Label>
                    <Switch
                        id={`switch-${selectedDay.dayOfWeek}`}
                        checked={selectedDay.isActive}
                        onCheckedChange={(checked: boolean) =>
                            setSelectedDay((prev) => ({ ...prev, isActive: checked }))
                        }
                    />
                </div>
            </div>

            {selectedDay.isActive && (
                <div className="grid w-[400px] grid-cols-4 gap-2">
                    <RangeTimeInput
                        label="Morning"
                        setTime={(time) => setSelectedDay((prev) => ({ ...prev, morningStart: time }))}
                        time={selectedDay.morningStart}
                    />
                    <RangeTimeInput
                        label="to"
                        setTime={(time) => setSelectedDay((prev) => ({ ...prev, morningEnd: time }))}
                        time={selectedDay.morningEnd}
                    />
                    <RangeTimeInput
                        label="Afternoon"
                        setTime={(time) => setSelectedDay((prev) => ({ ...prev, afternoonStart: time }))}
                        time={selectedDay.afternoonStart}
                    />
                    <RangeTimeInput
                        label="to"
                        setTime={(time) => setSelectedDay((prev) => ({ ...prev, afternoonEnd: time }))}
                        time={selectedDay.afternoonEnd}
                    />
                </div>
            )}
        </div>
    );
}
