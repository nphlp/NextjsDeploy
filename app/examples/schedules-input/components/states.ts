"use client";

import { Time } from "@internationalized/date";
import { DayOfWeek } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { WorkDayTemplate } from "./input-schedules";

export default function useSchedule() {
    const defaultTimes = {
        morningStart: new Time(9, 0),
        morningEnd: new Time(12, 0),
        afternoonStart: new Time(13, 0),
        afternoonEnd: new Time(17, 0),
    };

    const [mondaySchedule, setMondaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.MONDAY,
        isActive: true,
        ...defaultTimes,
    });
    const [tuesdaySchedule, setTuesdaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.TUESDAY,
        isActive: true,
        ...defaultTimes,
    });
    const [wednesdaySchedule, setWednesdaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.WEDNESDAY,
        isActive: false,
        ...defaultTimes,
    });
    const [thursdaySchedule, setThursdaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.THURSDAY,
        isActive: false,
        ...defaultTimes,
    });
    const [fridaySchedule, setFridaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.FRIDAY,
        isActive: false,
        ...defaultTimes,
    });
    const [saturdaySchedule, setSaturdaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.SATURDAY,
        isActive: false,
        ...defaultTimes,
    });
    const [sundaySchedule, setSundaySchedule] = useState<WorkDayTemplate>({
        dayOfWeek: DayOfWeek.SUNDAY,
        isActive: false,
        ...defaultTimes,
    });

    const selectedDays = [
        mondaySchedule,
        tuesdaySchedule,
        wednesdaySchedule,
        thursdaySchedule,
        fridaySchedule,
        saturdaySchedule,
        sundaySchedule,
    ].filter((day) => day !== undefined);

    const setSelectedDays: Dispatch<SetStateAction<WorkDayTemplate>>[] = [
        setMondaySchedule,
        setTuesdaySchedule,
        setWednesdaySchedule,
        setThursdaySchedule,
        setFridaySchedule,
        setSaturdaySchedule,
        setSundaySchedule,
    ];

    return { selectedDays, setSelectedDays };
}
