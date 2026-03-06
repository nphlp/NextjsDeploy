"use client";

import { useSyncExternalStore } from "react";

let open = false;

const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function getSnapshot() {
    return open;
}

function getServerSnapshot() {
    return false;
}

function setOpen(value: boolean) {
    open = value;
    notify();
}

function toggle() {
    open = !open;
    notify();
}

export default function useDevSidebar() {
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return { open: state, setOpen, toggle };
}
