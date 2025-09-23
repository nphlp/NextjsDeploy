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

export const defaultTheme: Theme = "system";

export const themeSchema: ZodType<ThemeCookie | undefined> = z
    .object({
        theme: z.enum(["light", "dark", "system"]),
        systemTheme: z.enum(["light", "dark"]),
    })
    .optional();

export const validateTheme = (cookieTheme: string | undefined) => {
    return themeSchema.parse(cookieTheme);
};

export const resolveThemeToApply = (theme: Theme, systemTheme: SystemTheme): SystemTheme => {
    if (theme === "system") return systemTheme;
    return theme;
};
