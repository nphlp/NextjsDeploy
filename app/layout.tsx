import { cn } from "@comps/SHADCN/lib/utils";
import Breakpoints from "@comps/UI/breakpoints";
import Footer from "@core/Footer";
import Header from "@core/Header";
import Html from "@core/Html";
import Main from "@core/Main";
import Theme from "@core/Theme";
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
    title: "Nextjs Deploy",
    description: "A ready to deploy application template 📝",
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
            <body className={cn(geistSans.variable, geistMono.variable, "isolate h-full")}>
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
