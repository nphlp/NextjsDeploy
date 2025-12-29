import cn from "@lib/cn";
import { ReactNode, Suspense } from "react";
import { getTheme } from "./theme/theme-server";

type HtmlProps = {
    /**
     * Enable server-side rendering of theme class on HTML element
     * - `true`: prevent theme flashing on initial load, but make HTML component dynamic, that subsequently disable static optimization
     * - `false`: keep static HTML component, but may have a short theme flashing on initial load
     */
    ssrTheme: boolean;
    children?: ReactNode;
};

export default async function Html(props: HtmlProps) {
    const { ssrTheme, children } = props;

    if (!ssrTheme) {
        return (
            <html lang="fr" className="h-full antialiased">
                {children}
            </html>
        );
    }

    return (
        <Suspense
            fallback={
                <html lang="fr" className="h-full antialiased">
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
        <html lang="fr" className={cn("h-full antialiased", themeCookie?.themeClass)}>
            {children}
        </html>
    );
};
