"use client";

import Button from "@atoms/button";
import { CounterState } from "../_lib/cookie-params";
import useCounterCookieParams from "../_lib/use-cookie-params";

type ButtonUpProps = {
    initialState: CounterState | undefined;
};

export default function ButtonUp(props: ButtonUpProps) {
    const { initialState } = props;
    const { increment } = useCounterCookieParams(initialState);

    return (
        <Button label="Increment" onClick={increment}>
            +1
        </Button>
    );
}
