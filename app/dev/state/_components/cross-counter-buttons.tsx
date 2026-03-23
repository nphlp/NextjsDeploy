"use client";

import Button from "@atoms/button";
import useCrossCounter from "../_lib/use-cross-counter";

export default function CrossCounterButtons() {
    const { increment, decrement } = useCrossCounter();

    return (
        <div className="flex items-center gap-4">
            <Button label="Decrement" onClick={decrement}>
                -1
            </Button>
            <Button label="Increment" onClick={increment}>
                +1
            </Button>
        </div>
    );
}
