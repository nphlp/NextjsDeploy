import ThemeProvider from "@core/theme/theme-provider";
import { ReactNode, Suspense } from "react";
import { getTheme } from "./theme/theme-server";

type ThemeProps = {
    children?: ReactNode;
};

export default async function Theme(props: ThemeProps) {
    return (
        <Suspense>
            <SuspendedTheme {...props} />
        </Suspense>
    );
}

const SuspendedTheme = async (props: ThemeProps) => {
    const { children } = props;

    const themeCookie = await getTheme();

    return <ThemeProvider initialTheme={themeCookie?.theme}>{children}</ThemeProvider>;
};
