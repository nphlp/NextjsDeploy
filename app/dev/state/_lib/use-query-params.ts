"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export default function useQueryCounter() {
    const [count, setCount] = useQueryState("count", queryParams.count);

    const increment = () => setCount((prev) => prev + 1);
    const decrement = () => setCount((prev) => prev - 1);

    return { count, increment, decrement };
}
