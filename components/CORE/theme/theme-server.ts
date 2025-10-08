import { cookies } from "next/headers";
import "server-only";
import { ThemeCookie, themeCookieName, validateTheme } from "./theme-utils";

type GetThemeType = (ThemeCookie & { themeClass: string }) | undefined;

export async function getTheme(): Promise<GetThemeType> {
    // Get cookies
    const cookieStore = await cookies();

    // Get theme cookie
    const themeCookieString = cookieStore.get(themeCookieName)?.value;

    // Parse if exists
    const themeCookieObject = themeCookieString ? JSON.parse(themeCookieString) : undefined;

    // Validate cookie
    const themeCookie = validateTheme(themeCookieObject);

    if (!themeCookie) return undefined;

    // Extract values
    const { theme, systemTheme } = themeCookie;

    // Determine theme class to apply
    const themeClass = themeCookie?.theme === "system" ? themeCookie.systemTheme : themeCookie?.theme;

    return { theme, systemTheme, themeClass };
}
