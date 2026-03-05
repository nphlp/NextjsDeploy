import cn from "@lib/cn";
import { ReactNode, Suspense } from "react";
import { DEBUG_LAYOUT, SSR_THEME } from "./config";
import { getTheme } from "./theme/theme-server";

type HtmlProps = {
    children?: ReactNode;
};

export default async function Html(props: HtmlProps) {
    const { children } = props;

    if (!SSR_THEME) {
        return (
            <html lang="fr" className={cn("min-h-dvh", DEBUG_LAYOUT && "bg-amber-100")}>
                {children}
            </html>
        );
    }

    return (
        <Suspense
            fallback={
                <html lang="fr" className={cn("min-h-dvh", DEBUG_LAYOUT && "bg-amber-100")}>
                    {children}
                </html>
            }
        >
            <SuspendedHtml {...props} />
        </Suspense>
    );
}

const SuspendedHtml = async (props: HtmlProps) => {
    const { children } = props;

    const themeCookie = await getTheme();

    return (
        <html lang="fr" className={cn("min-h-dvh", DEBUG_LAYOUT && "bg-amber-100", themeCookie?.themeClass)}>
            {children}
        </html>
    );
};
