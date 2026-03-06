"use client";

import { deleteCookie, readCookie, writeCookie } from "@lib/cookie-client";
import { Dispatch, SetStateAction, useSyncExternalStore } from "react";

// Synthetic cookie event system
const listeners = new Set<() => void>();

// Simulate a "cookie event triggeration"
function notify() {
    listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function getSnapshot<T extends string | object>(name: string, initialValue: T): () => T {
    return () => readCookie<T>(name) ?? initialValue;
}

function getServerSnapshot<T extends string | object>(initialValue: T): () => T {
    return () => initialValue;
}

export function useCookieState<T extends string | object>(
    name: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const state = useSyncExternalStore(subscribe, getSnapshot(name, initialValue), getServerSnapshot(initialValue));

    const setState: Dispatch<SetStateAction<T>> = (action) => {
        const currentValue = readCookie<T>(name) ?? initialValue;
        const newValue = typeof action === "function" ? (action as (prev: T) => T)(currentValue) : action;
        writeCookie(name, newValue);
        notify();
    };

    return [state, setState];
}

export function removeCookieState(name: string) {
    deleteCookie(name);
    notify();
}
