import ThemeProvider from "@core/theme/theme-provider";
import { ReactNode, Suspense } from "react";
import { SSR_THEME } from "./config";
import { getTheme } from "./theme/theme-server";

type ThemeProps = {
    children?: ReactNode;
};

export default async function Theme(props: ThemeProps) {
    const { children } = props;

    if (!SSR_THEME) {
        return (
            <Suspense>
                <ThemeProvider initialTheme={undefined}>{children}</ThemeProvider>
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

    const themeCookie = await getTheme();

    return <ThemeProvider initialTheme={themeCookie?.theme}>{children}</ThemeProvider>;
};
