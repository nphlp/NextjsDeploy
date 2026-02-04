import cn from "@lib/cn";
import { ReactNode, Suspense } from "react";
import { DEBUG_LAYOUT } from "./config";
import { getTheme } from "./theme/theme-server";

type HtmlProps = {
    /**
     * Enable server-side rendering of theme class on HTML element
     * - `true`: prevent theme flashing on initial load, but make HTML component dynamic, that subsequently disable static optimization
     * - `false`: keep static HTML component, but may have a short theme flashing on initial load
     */
    ssrTheme?: boolean;
    children?: ReactNode;
};

export default async function Html(props: HtmlProps) {
    const { ssrTheme = false, children } = props;

    if (!ssrTheme) {
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
