"use client";

import useCrossCounter from "../_lib/use-cross-counter";

export default function CrossCounterDisplay() {
    const { count } = useCrossCounter();

    return <span className="text-2xl font-bold tabular-nums">{count}</span>;
}
