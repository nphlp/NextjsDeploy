"use client";

import { useCookieState } from "@lib/cookie-state-client";
import { type CounterState, defaultCounterState } from "./cookie-params";

export default function useCounterCookieParams(initialState: CounterState | undefined) {
    const [state, setState] = useCookieState("demo-counter", initialState ?? defaultCounterState);

    const count = state.count;
    const increment = () => setState((prev) => ({ count: prev.count + 1 }));
    const decrement = () => setState((prev) => ({ count: prev.count - 1 }));

    return { count, increment, decrement };
}
