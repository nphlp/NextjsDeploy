import ThemeProvider from "@core/theme/theme-provider";
import { getCookieState } from "@lib/cookie-state-server";
import { ReactNode, Suspense } from "react";
import { SSR_THEME } from "./config";
import { themeCookieName, themeSchema } from "./theme/theme-utils";

type ThemeProps = {
    children?: ReactNode;
};

export default async function Theme(props: ThemeProps) {
    const { children } = props;

    if (!SSR_THEME) {
        return (
            <Suspense>
                <ThemeProvider initialThemeCookie={undefined}>{children}</ThemeProvider>
            </Suspense>
        );
    }

    return (
        <Suspense>
            <SuspendedTheme>{children}</SuspendedTheme>
        </Suspense>
    );
}

const SuspendedTheme = async (props: ThemeProps) => {
    const { children } = props;

    const themeCookie = await getCookieState(themeCookieName, themeSchema);

    return <ThemeProvider initialThemeCookie={themeCookie}>{children}</ThemeProvider>;
};
