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

    return (
        <Html ssrTheme={false}>
            <body
                className={cn(geistSans.variable, geistMono.variable, "bg-background text-foreground isolate h-full")}
            >
                <NuqsAdapter>
                    <Theme>
                        <Header />
                        <Main>{children}</Main>
                        <Footer />
                        <Breakpoints mode="onResize" />
                        <Toaster />
                    </Theme>
                </NuqsAdapter>
            </body>
        </Html>
    );
}
