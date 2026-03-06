"use client";

import Button from "@atoms/button";
import { CounterState } from "../_lib/cookie-params";
import useCounterCookieParams from "../_lib/use-cookie-params";

type ButtonDownProps = {
    initialState: CounterState | undefined;
};

export default function ButtonDown(props: ButtonDownProps) {
    const { initialState } = props;
    const { decrement } = useCounterCookieParams(initialState);

    return (
        <Button label="Decrement" onClick={decrement}>
            -1
        </Button>
    );
}
