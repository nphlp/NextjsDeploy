"use client";

import { CounterCookie } from "../_lib/cookie-params";
import useCookieCounter from "../_lib/use-cookie-params";
import CounterButtons from "./counter-buttons";

type CookieCounterProps = {
    initialState: CounterCookie | undefined;
};

export default function CookieCounter(props: CookieCounterProps) {
    const { count, increment, decrement } = useCookieCounter(props.initialState);

    return <CounterButtons count={count} increment={increment} decrement={decrement} />;
}
