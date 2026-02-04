"use client";

import cn from "@lib/cn";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <footer className={cn("flex flex-col items-center justify-center", "px-4 py-12")}>
            <h2 className="text-2xl font-bold">Nextjs Deploy</h2>
            <p>A ready to deploy application template.</p>
        </footer>
    );
}
