"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { getSystemTheme, setThemeClass, setThemeCookie } from "./theme-client";
import { ThemeContext } from "./theme-context";
import { SystemTheme, Theme, defaultTheme } from "./theme-utils";

type ContextProviderProps = {
    initialTheme: Theme | undefined;
    children: ReactNode;
};

export default function ThemeProvider(props: ContextProviderProps) {
    const { initialTheme, children } = props;

    // Use initial data to prevent hydration issues
    const [theme, setTheme] = useState<Theme>(initialTheme ?? defaultTheme);

    // Do not trust server, start with undefined system theme
    const resolvedThemeRef = useRef<SystemTheme>(undefined);

    const toggleTheme = () => {
        if (theme === "system") setTheme("dark");
        if (theme === "dark") setTheme("light");
        if (theme === "light") setTheme("system");
    };

    // Update resolvedTheme (on first load)
    useEffect(() => {
        resolvedThemeRef.current = getSystemTheme();
        setThemeClass(defaultTheme, resolvedThemeRef.current);
        setThemeCookie(defaultTheme);
    }, []);

    // Update CSS and cookie when user change theme
    useEffect(() => {
        const systemTheme = getSystemTheme();
        resolvedThemeRef.current = systemTheme;
        setThemeClass(theme, systemTheme);
        setThemeCookie(theme);
    }, [theme]);

    // Update theme if system preference changes and theme is "system"
    useEffect(() => {
        const mediaLight = window.matchMedia("(prefers-color-scheme: light)");
        const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            // Must match to "light" or "dark" and current theme must be "system"
            if (!e.matches || theme !== "system") return;

            const newSystemTheme = getSystemTheme();
            resolvedThemeRef.current = newSystemTheme;

            setThemeClass("system", newSystemTheme);
            setThemeCookie("system");
        };

        // Add listener
        mediaLight.addEventListener("change", handleChange);
        mediaDark.addEventListener("change", handleChange);

        // Cleanup listener on unmount
        return () => {
            mediaLight.removeEventListener("change", handleChange);
            mediaDark.removeEventListener("change", handleChange);
        };
    }, [theme]);

    const value = { theme, systemTheme: resolvedThemeRef.current, setTheme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
