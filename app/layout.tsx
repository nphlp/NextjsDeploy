import ToastProvider from "@atoms/toast/toast";
import Breakpoints from "@comps/breakpoints";
import Footer from "@core/Footer";
import Header from "@core/Header";
import Html from "@core/Html";
import Theme from "@core/Theme";
import { DEBUG_LAYOUT } from "@core/config";
import cn from "@lib/cn";
import { IS_UMAMI_DEFINED, UMAMI_WEBSITE_ID } from "@lib/env";
import "@lib/orpc-server";
import "@public/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Nextjs Deploy",
    description: "A ready to deploy application template",
};

type LayoutProps = Readonly<{
    children: ReactNode;
}>;

export default async function Layout(props: LayoutProps) {
    const { children } = props;

    return (
        <Html>
            <body
                className={cn(
                    geistSans.variable,
                    geistMono.variable,
                    "bg-background text-foreground",
                    "isolate", // Base UI for portaled elements
                    "antialiased", // Nextjs recommendation for font rendering
                    "min-h-dvh",
                    DEBUG_LAYOUT && "bg-red-100",
                )}
            >
                <ToastProvider>
                    <NuqsAdapter>
                        <Theme>
                            <Header />
                            {children}
                            <Footer />
                            <Breakpoints mode="onResize" />
                        </Theme>
                    </NuqsAdapter>
                </ToastProvider>
                {IS_UMAMI_DEFINED && (
                    <Script
                        src="/api/umami/script.js"
                        data-host-url="/api/umami"
                        data-website-id={UMAMI_WEBSITE_ID}
                        defer
                    />
                )}
            </body>
        </Html>
    );
}
