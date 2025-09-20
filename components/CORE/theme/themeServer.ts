import { cookies } from "next/headers";
import "server-only";
import { ThemeCookie, themeCookieName, validateTheme } from "./themeUtils";

type GetThemeType = (ThemeCookie & { themeClass: string }) | undefined;

export async function getTheme(): Promise<GetThemeType> {
    const cookieStore = await cookies();
    const themeCookieString = cookieStore.get(themeCookieName)?.value;
    const themeCookieObject = themeCookieString ? JSON.parse(themeCookieString) : undefined;
    const themeCookie = validateTheme(themeCookieObject);

    if (!themeCookie) return undefined;

    const { theme, systemTheme } = themeCookie;
    const themeClass = themeCookie?.theme === "system" ? themeCookie.systemTheme : themeCookie?.theme;

    return { theme, systemTheme, themeClass };
}
