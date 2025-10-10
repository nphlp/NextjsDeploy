"use client";

import { Time } from "@internationalized/date";
import { DateInput, TimeField } from "@shadcn/ui/datefield-rac";
import { Label } from "react-aria-components";

type TimeInputProps = {
    label: string;
    setTime: (time: Time | null) => void;
    time: Time | null;
};

export default function TimeInput(props: TimeInputProps) {
    const { label, setTime, time } = props;

    return (
        <TimeField className="space-y-2" onChange={setTime} value={time}>
            <Label className="text-foreground text-sm font-medium">{label}</Label>
            <DateInput />
        </TimeField>
    );
}
