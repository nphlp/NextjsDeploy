"use client";

import Button from "@atoms/button";

type CounterButtonsProps = {
    count: number;
    increment: () => void;
    decrement: () => void;
};

export default function CounterButtons(props: CounterButtonsProps) {
    const { count, increment, decrement } = props;

    return (
        <div className="flex items-center gap-4">
            <Button label="Decrement" onClick={decrement}>
                -1
            </Button>
            <span className="w-12 text-center text-2xl font-bold tabular-nums">{count}</span>
            <Button label="Increment" onClick={increment}>
                +1
            </Button>
        </div>
    );
}
