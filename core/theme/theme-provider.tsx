"use client";

import { useCookieState } from "@lib/cookie-state-client";
import { ReactNode, useEffect } from "react";
import { getSystemTheme, setThemeClass } from "./theme-client";
import { ThemeContext } from "./theme-context";
import { Theme, ThemeCookie, defaultTheme, themeCookieName } from "./theme-utils";
import { useSystemTheme } from "./use-system-theme";

type ThemeProviderProps = {
    initialThemeCookie: ThemeCookie | undefined;
    children: ReactNode;
};

const defaultThemeCookie: ThemeCookie = { theme: defaultTheme, systemTheme: "light" };

export default function ThemeProvider(props: ThemeProviderProps) {
    const { initialThemeCookie, children } = props;

    const [themeCookie, setThemeCookie] = useCookieState(themeCookieName, initialThemeCookie ?? defaultThemeCookie);
    const systemTheme = useSystemTheme();

    const theme = themeCookie.theme;

    const setTheme = (newTheme: Theme) => {
        setThemeCookie({ theme: newTheme, systemTheme: systemTheme ?? getSystemTheme() });
    };

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
