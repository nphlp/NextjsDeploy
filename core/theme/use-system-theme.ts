"use client";

import { useSyncExternalStore } from "react";
import { SystemTheme } from "./theme-utils";

function subscribe(callback: () => void) {
    // Event
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Add event listener
    mediaQuery.addEventListener("change", callback);

    // Cleanup event listener
    return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot(): SystemTheme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): SystemTheme | undefined {
    return undefined;
}

export function useSystemTheme(): SystemTheme | undefined {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
