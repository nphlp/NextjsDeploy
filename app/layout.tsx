import Footer from "@comps/CORE/Footer";
import Header from "@comps/CORE/Header";
import Main from "@comps/CORE/Main";
import ThemeProvider from "@comps/CORE/theme/theme-provider";
import { getTheme } from "@comps/CORE/theme/theme-server";
import { cn } from "@comps/SHADCN/lib/utils";
import Breakpoints from "@comps/UI/breakpoints";
import { getSession } from "@lib/authServer";
import { Toaster } from "@shadcn/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
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
    title: "Pulse Work",
    description: "Time attendance and team management software 📝",
};

type LayoutProps = Readonly<{
    children: ReactNode;
}>;

export default async function Layout(props: LayoutProps) {
    const { children } = props;

    const themeCookie = await getTheme();
    const session = await getSession();

    // Height relative to font-size 16px
    const headerHeight = 4; // 64px = 4rem

    return (
        <html lang="fr" className={cn("h-full antialiased", themeCookie?.themeClass)}>
            <body className={cn(geistSans.variable, geistMono.variable, "h-full font-mono")}>
                <NuqsAdapter>
                    <ThemeProvider initialTheme={themeCookie?.theme}>
                        <Header headerHeight={headerHeight} serverSession={session} />
                        <Main offsetHeader={headerHeight}>{children}</Main>
                        <Footer />
                        <Breakpoints mode="onResize" />
                        <Toaster />
                    </ThemeProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}
