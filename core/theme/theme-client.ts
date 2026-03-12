"use client";

import { SystemTheme, Theme, resolveThemeToApply } from "./theme-utils";

/**
 * Get system color scheme preference
 */
export const getSystemTheme = (): SystemTheme => {
    const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return hasDarkPreference ? "dark" : "light";
};

/**
 * Set CSS class on HTML element
 */
export const setThemeClass = (theme: Theme, systemTheme: SystemTheme) => {
    const themeToApply = resolveThemeToApply(theme, systemTheme);

    const transitions = transitionManager();
    const htmlClass = document.documentElement.classList;

    // Disable transitions when changing theme
    transitions.disable();

    // Force reflow
    // eslint-disable-next-line
    document.documentElement.scrollHeight;

    // Remove old theme
    htmlClass.remove("light", "dark");

    // Apply new theme
    if (themeToApply === "light") htmlClass.add("light");
    if (themeToApply === "dark") htmlClass.add("dark");

    // Sync data attribute for CSS-driven icon visibility
    document.documentElement.dataset.themePreference = theme;

    // Force reflow
    // eslint-disable-next-line
    document.documentElement.scrollHeight;

    // Re-enable transitions
    transitions.enable();
};

const transitionManager = () => {
    const style = document.createElement("style");

    const css = document.createTextNode(
        "* { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }",
    );

    style.appendChild(css);

    const enable = () => document.head.removeChild(style);
    const disable = () => document.head.appendChild(style);

    return { enable, disable };
};
