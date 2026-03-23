"use client";

import { createExternalStore, useExternalStore } from "@utils/use-external-store";

const crossCounterStore = createExternalStore(0);

export default function useCrossCounter() {
    const [count, setCount] = useExternalStore(crossCounterStore);

    const increment = () => setCount((prev) => prev + 1);
    const decrement = () => setCount((prev) => prev - 1);

    return { count, increment, decrement };
}
