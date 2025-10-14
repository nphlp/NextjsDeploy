"use client";

import RangeTimeInput from "@comps/SHADCN/components/time-input";
import { $Enums, DayOfWeek } from "@prisma/client";
import { Label } from "@shadcn/ui/label";
import { Switch } from "@shadcn/ui/switch";
import { ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { WorkDayTemplate } from "./states";

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
                <div className="flex items-end justify-between gap-4">
                    <RangeTimeInput
                        setTime={(time) => setSelectedDay((prev) => ({ ...prev, arriving: time }))}
                        time={selectedDay.arriving}
                    />
                    <ArrowRight className="mb-2.5 size-4 shrink-0" />
                    <RangeTimeInput
                        setTime={(time) => setSelectedDay((prev) => ({ ...prev, leaving: time }))}
                        time={selectedDay.leaving}
                    />
                </div>
            )}
        </div>
    );
}
