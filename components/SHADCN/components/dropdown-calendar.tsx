"use client";

import { Button } from "@shadcn/ui/button";
import { Calendar } from "@shadcn/ui/calendar";
import { Label } from "@shadcn/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Matcher } from "react-day-picker";

type DropdownCalendarProps = {
    label: string;
    setDate: Dispatch<SetStateAction<Date | undefined>>;
    date: Date | undefined;
    optional?: boolean;
    disabled?: Matcher | Matcher[] | undefined;
};

export default function DropdownCalendar(props: DropdownCalendarProps) {
    const { label, setDate, date, optional = false, disabled } = props;

    const [open, setOpen] = useState(false);

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex items-end gap-1">
                <Label htmlFor="date" className="px-1">
                    {label}
                </Label>
                {!!optional && <div className="text-gray-middle text-2xs font-bold uppercase">Optionnel</div>}
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                        {date ? dayjs(date).locale("fr").format("D MMM YYYY") : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date);
                            setOpen(false);
                        }}
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
