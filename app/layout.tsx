import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <body className={combo(geistSans.variable, geistMono.variable, "h-full")}>{children}</body>
        </html>
    );
}
