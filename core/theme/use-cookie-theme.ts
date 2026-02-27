"use client";

import { useSyncExternalStore } from "react";
import { getThemeCookie, setThemeCookie } from "./theme-client";
import { Theme, defaultTheme } from "./theme-utils";

const syntheticCookieEventListeners = new Set<() => void>();

function triggerCookieEvent() {
    syntheticCookieEventListeners.forEach((callback) => callback());
}

function subscribe(callback: () => void) {
    syntheticCookieEventListeners.add(callback);
    return () => syntheticCookieEventListeners.delete(callback);
}

function getSnapshot(): Theme {
    return getThemeCookie();
}

function getServerSnapshot(serverTheme?: Theme): () => Theme {
    return () => serverTheme ?? defaultTheme;
}

function setTheme(newTheme: Theme) {
    setThemeCookie(newTheme);
    triggerCookieEvent();
}

export function useCookieTheme(serverTheme?: Theme) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot(serverTheme));
    return { theme, setTheme };
}
