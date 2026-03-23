"use client";

import useQueryCounter from "../_lib/use-query-params";
import CounterButtons from "./counter-buttons";

export default function QueryCounter() {
    const { count, increment, decrement } = useQueryCounter();

    return <CounterButtons count={count} increment={increment} decrement={decrement} />;
}
