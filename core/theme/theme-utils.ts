import z, { ZodType } from "zod";

export type SystemTheme = "light" | "dark";
export type Theme = SystemTheme | "system";

export type ThemeCookie = {
    theme: Theme;
    systemTheme: SystemTheme;
};

export type UseTheme = {
    theme: Theme;
    systemTheme?: SystemTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

export const themeCookieName = "theme-preference";

export const themeSchema = z.object({
    theme: z.enum(["light", "dark", "system"]),
    systemTheme: z.enum(["light", "dark"]),
}) satisfies ZodType<ThemeCookie>;

export const resolveThemeToApply = (theme: Theme, systemTheme: SystemTheme): SystemTheme => {
    if (theme === "system") return systemTheme;
    return theme;
};

export const resolveThemeClass = (themeCookie: ThemeCookie | undefined): SystemTheme | undefined => {
    if (!themeCookie) return undefined;
    return resolveThemeToApply(themeCookie.theme, themeCookie.systemTheme);
};
