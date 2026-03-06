"use client";

import { CounterState } from "../_lib/cookie-params";
import useCounterCookieParams from "../_lib/use-cookie-params";

type CounterProps = {
    initialState: CounterState | undefined;
};

export default function Counter(props: CounterProps) {
    const { initialState } = props;
    const { count } = useCounterCookieParams(initialState);

    return <p className="text-4xl font-bold tabular-nums">{count}</p>;
}
