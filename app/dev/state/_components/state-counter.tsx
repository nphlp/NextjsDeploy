"use client";

import { useState } from "react";
import CounterButtons from "./counter-buttons";

export default function StateCounter() {
    const [count, setCount] = useState(0);

    const increment = () => setCount((prev) => prev + 1);
    const decrement = () => setCount((prev) => prev - 1);

    return <CounterButtons count={count} increment={increment} decrement={decrement} />;
}
