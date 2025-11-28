import Footer from "@comps/CORE/Footer";
import Header from "@comps/CORE/Header";
import Html from "@comps/CORE/Html";
import Main from "@comps/CORE/Main";
import Theme from "@comps/CORE/Theme";
import { cn } from "@comps/SHADCN/lib/utils";
import Breakpoints from "@comps/UI/breakpoints";
import "@lib/orpc-server";
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

    // Height relative to font-size 16px
    const headerHeight = 4; // 64px = 4rem

    return (
        <Html ssrTheme={false}>
            <body className={cn(geistSans.variable, geistMono.variable, "h-full")}>
                <NuqsAdapter>
                    <Theme>
                        <Header headerHeight={headerHeight} />
                        <Main offsetHeader={headerHeight}>{children}</Main>
                        <Footer />
                        <Breakpoints mode="onResize" />
                        <Toaster />
                    </Theme>
                </NuqsAdapter>
            </body>
        </Html>
    );
}
