"use client";

import { Dispatch, SetStateAction, useSyncExternalStore } from "react";

type ExternalStore<T> = {
    subscribe: (callback: () => void) => () => void;
    getSnapshot: () => T;
    getServerSnapshot: () => T;
    setState: Dispatch<SetStateAction<T>>;
};

/**
 * Create a module-level reactive store for cross-component state.
 *
 * @param initialValue - Initial value (also used as SSR default unless `serverValue` is provided)
 * @param serverValue - Optional SSR-safe default (when it differs from `initialValue`)
 */
export function createExternalStore<T>(initialValue: T, serverValue?: T): ExternalStore<T> {
    let state = initialValue;
    const listeners = new Set<() => void>();

    function notify() {
        listeners.forEach((l) => l());
    }

    return {
        subscribe(callback: () => void) {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },
        getSnapshot() {
            return state;
        },
        getServerSnapshot() {
            return serverValue ?? initialValue;
        },
        setState(action: SetStateAction<T>) {
            state = typeof action === "function" ? (action as (prev: T) => T)(state) : action;
            notify();
        },
    };
}

/**
 * Subscribe to an external store created with `createExternalStore`.
 * Returns `[state, setState]` like `useState`.
 */
export function useExternalStore<T>(store: ExternalStore<T>): [T, Dispatch<SetStateAction<T>>] {
    const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
    return [state, store.setState];
}
