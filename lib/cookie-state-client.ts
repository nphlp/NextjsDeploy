"use client";

import { deleteCookie, readCookie, writeCookie } from "@lib/cookie-client";
import { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from "react";

// Synthetic cookie event system
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((l) => l());
}

export function useCookieState<T extends string | object>(
    name: string,
    initialValue: T,
    options?: { path?: string },
): [T, Dispatch<SetStateAction<T>>] {
    const initialValueRef = useRef(initialValue);

    const [state, setStateInternal] = useState<T>(initialValue);

    useLayoutEffect(() => {
        const callback = () => {
            const newValue = readCookie<T>(name) ?? initialValueRef.current;
            setStateInternal(newValue);
        };
        listeners.add(callback);
        callback();
        return () => {
            listeners.delete(callback);
        };
    }, [name]);

    const setState: Dispatch<SetStateAction<T>> = (action) => {
        const currentValue = readCookie<T>(name) ?? initialValueRef.current;
        const newValue = typeof action === "function" ? (action as (prev: T) => T)(currentValue) : action;
        writeCookie(name, newValue, { path: options?.path });
        notify();
    };

    return [state, setState];
}

export function removeCookieState(name: string) {
    deleteCookie(name);
    notify();
}
