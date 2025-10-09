import Footer from "@comps/CORE/Footer";
import Header from "@comps/CORE/Header";
import ThemeProvider from "@comps/CORE/theme/theme-provider";
import { getTheme } from "@comps/CORE/theme/theme-server";
import ArrowToTop from "@comps/UI/arrowToTop";
import Breakpoints from "@comps/UI/breakpoints";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import { combo } from "@/lib/combo";
import "@/public/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Next.js Deploy",
    description: "A Next.js project ready to be deployed 📝",
};

type LayoutProps = Readonly<{
    children: ReactNode;
}>;

export default async function Layout(props: LayoutProps) {
    const { children } = props;

    const themeCookie = await getTheme();

    return (
        <html
            lang="fr"
            className={combo(
                // Layout
                "h-full antialiased",
                // Apply theme from server
                themeCookie?.themeClass,
            )}
        >
            <body
                className={combo(
                    // Font imports
                    geistSans.variable,
                    geistMono.variable,
                    // Theme and base styles
                    "bg-background text-foreground! font-mono",
                    // Layout
                    "flex h-full flex-col",
                )}
            >
                <NuqsAdapter>
                    <ThemeProvider initialTheme={themeCookie?.theme}>
                        <Header />
                        <div id="main" className="flex-1 overflow-y-auto">
                            <main className="flex min-h-full flex-col items-center justify-center">{children}</main>
                            <Footer />
                        </div>
                        <Breakpoints mode="onResize" />
                        <ArrowToTop />
                    </ThemeProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}
