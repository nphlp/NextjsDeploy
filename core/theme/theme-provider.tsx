"use client";

import { ReactNode, useEffect, useState } from "react";
import { setThemeClass, setThemeCookie } from "./theme-client";
import { ThemeContext } from "./theme-context";
import { Theme, defaultTheme } from "./theme-utils";
import { useSystemTheme } from "./use-system-theme";

type ContextProviderProps = {
    initialTheme: Theme | undefined;
    children: ReactNode;
};

export default function ThemeProvider(props: ContextProviderProps) {
    const { initialTheme, children } = props;

    // Use initial data to prevent hydration issues
    const [theme, setTheme] = useState<Theme>(initialTheme ?? defaultTheme);

    // Sync system theme using useSyncExternalStore (SSR safe)
    // Do not trust server, start with undefined system theme
    const systemTheme = useSystemTheme();

    const toggleTheme = () => {
        if (theme === "system") setTheme("dark");
        if (theme === "dark") setTheme("light");
        if (theme === "light") setTheme("system");
    };

    // Update CSS class and cookie
    useEffect(() => {
        if (systemTheme === undefined) return;

        // Update CSS class
        setThemeClass(theme, systemTheme);

        // Update cookie
        setThemeCookie(theme);
    }, [theme, systemTheme]);

    const value = { theme, systemTheme, setTheme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
