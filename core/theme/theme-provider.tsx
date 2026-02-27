"use client";

import { ReactNode, useEffect } from "react";
import { setThemeClass } from "./theme-client";
import { ThemeContext } from "./theme-context";
import { Theme } from "./theme-utils";
import { useCookieTheme } from "./use-cookie-theme";
import { useSystemTheme } from "./use-system-theme";

type ContextProviderProps = {
    initialTheme: Theme | undefined;
    children: ReactNode;
};

export default function ThemeProvider(props: ContextProviderProps) {
    const { initialTheme, children } = props;

    // Cookie is the single source of truth
    // initialTheme is used as server snapshot to prevent flash in SSR mode
    const { theme, setTheme } = useCookieTheme(initialTheme);
    const systemTheme = useSystemTheme();

    const toggleTheme = () => {
        if (theme === "system") setTheme("dark");
        if (theme === "dark") setTheme("light");
        if (theme === "light") setTheme("system");
    };

    // Update CSS class
    useEffect(() => {
        if (systemTheme === undefined) return;
        setThemeClass(theme, systemTheme);
    }, [theme, systemTheme]);

    const value = { theme, systemTheme, setTheme, toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
