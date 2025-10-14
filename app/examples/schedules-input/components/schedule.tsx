"use client";

import Button from "@comps/UI/button/button";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { useContext } from "react";
import { DeleteSchedule } from "@/actions/ScheduleAction";
import { Context } from "./context";
import { UserType } from "./fetch";

type ScheduleProps = {
    index: number;
    schedule: UserType["Contracts"][number]["Schedules"][number];
};

export default function Schedule(props: ScheduleProps) {
    const { schedule, index } = props;

    const { refetch } = useContext(Context);

    const from = dayjs(schedule.startDate).format("D MMM YYYY");
    const to = schedule.endDate ? dayjs(schedule.endDate).format("D MMM YYYY") : "Infinie";

    const handleDelete = async () => {
        const deleted = await DeleteSchedule({ id: schedule.id });

        console.log("Schedule deleted successfully", deleted);

        refetch();
    };

    const firstLetterUppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();

    const formatStringToTime = (time: string): string => {
        const [hour, minute] = time.split(":");
        return `${hour.padStart(2)}:${minute.padStart(2, "0")}`;
    };

    return (
        <div>
            <h3 className="text-gray-middle text-xs font-bold">Période {index + 1}</h3>
            <div className="flex items-center gap-4">
                <div className="text-sm">
                    <span>Du </span>
                    <span className="font-bold">{from}</span>
                    <span> au </span>
                    <span className="font-bold">{to}</span>
                </div>
                <Button
                    label="Supprimer la période"
                    onClick={handleDelete}
                    variant="ghost"
                    className={{ button: "p-1" }}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>

            {schedule.Days.map((day) => (
                <div key={day.id} className="flex gap-2 text-xs">
                    <span>{firstLetterUppercase(day.dayOfWeek)}</span>
                    <span>from</span>
                    <span className="font-bold">{formatStringToTime(day.arriving)}</span>
                    <span>to</span>
                    <span className="font-bold">{formatStringToTime(day.leaving)}</span>
                </div>
            ))}
        </div>
    );
}
