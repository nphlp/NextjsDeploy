"use client";

import { useCookieState } from "@lib/cookie-state-client";
import { type CounterCookie, defaultCounterCookie } from "./cookie-params";

export default function useCookieCounter(initialState: CounterCookie | undefined) {
    const [state, setState] = useCookieState("demo-state-cookie", initialState ?? defaultCounterCookie);

    const count = state.count;
    const increment = () => setState((prev) => ({ count: prev.count + 1 }));
    const decrement = () => setState((prev) => ({ count: prev.count - 1 }));

    return { count, increment, decrement };
}
