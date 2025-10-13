"use client";

import DropdownCalendar from "@comps/SHADCN/components/dropdown-calendar";
import Button from "@comps/UI/button/button";
import Card from "@comps/UI/card";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import { Time } from "@internationalized/date";
import { $Enums } from "@prisma/client";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { AddSchedule } from "@/actions/ScheduleAction";
import { Context } from "./context";
import DaySelector from "./day-selector";
import useSchedule from "./states";

export default function Form() {
    const { data, refetch } = useContext(Context);

    const [dateFrom, setDateFrom] = useState<Date | undefined>();
    const [dateTo, setDateTo] = useState<Date | undefined>();

    const { selectedDays, setSelectedDays } = useSchedule();

    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsFeedbackOpen(false);

        if (!dateFrom) {
            setFeedback({ message: "Veuillez sélectionner une date de début", mode: "error" });
            setIsFeedbackOpen(true);
            return;
        }

        // Start loading
        setIsLoading(true);

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

        try {
            const response = await AddSchedule({ dateFrom, dateTo, selectedDays: selectedDaysString });

            console.log("Schedule added:", response);

            setDateFrom(undefined);
            setDateTo(undefined);

            setFeedback({ message: "Période ajoutée avec succès", mode: "success" });
            setIsFeedbackOpen(true);
            setIsLoading(false);

            refetch();
        } catch (error) {
            setFeedback({ message: "Une erreur est survenue", mode: "error" });
            setIsFeedbackOpen(true);
            setIsLoading(false);

            console.log(error);
            return;
        }
    };

    const today = dayjs().startOf("day").toDate();

    return (
        <Card>
            <form className="space-y-4" action={handleSubmit}>
                <div className="space-y-6">
                    <h2 className="text-foreground text-sm font-bold">Période de planification</h2>
                    <div className="flex w-full justify-between gap-4">
                        <DropdownCalendar
                            label="Début"
                            setDate={setDateFrom}
                            date={dateFrom}
                            disabled={[
                                // Disable before today
                                (date) => date < today,
                                // Disable before dateTo
                                (date) => (dateTo ? date > dateTo : false),
                                // Disable all periods already defined
                                ...(data?.Contracts[0]?.Schedules.map(({ startDate, endDate }) => ({
                                    from: startDate!,
                                    to: endDate!,
                                })) ?? []),
                            ]}
                        />
                        <DropdownCalendar
                            label="Fin"
                            setDate={setDateTo}
                            date={dateTo}
                            optional
                            disabled={[
                                // // Disable before today
                                (date) => date < today,
                                // // Disable before dateFrom
                                (date) => (dateFrom ? date < dateFrom : false),
                                // Disable all periods already defined
                                ...(data?.Contracts[0]?.Schedules.map(({ startDate, endDate }) => ({
                                    from: startDate!,
                                    to: endDate!,
                                })) ?? []),
                            ]}
                        />
                    </div>
                </div>
                <hr />
                <DaySelector setSelectedDays={setSelectedDays} selectedDays={selectedDays} />
                <hr />
                <Feedback isFeedbackOpen={isFeedbackOpen} feedback={feedback} />
                <div className="flex justify-center">
                    <Button type="submit" label="Enregistrer" isLoading={isLoading} />
                </div>
            </form>
        </Card>
    );
}
