"use client";

import { Time } from "@internationalized/date";
import { DateInput, TimeField } from "@shadcn/ui/datefield-rac";

type TimeInputProps = {
    setTime: (time: Time | null) => void;
    time: Time | null;
};

export default function TimeInput(props: TimeInputProps) {
    const { setTime, time } = props;

    return (
        <TimeField className="w-full" onChange={setTime} value={time}>
            <DateInput className="justify-center" />
        </TimeField>
    );
}
