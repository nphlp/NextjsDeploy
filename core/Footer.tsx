"use client";

import { Link } from "@atoms/button";
import cn from "@lib/cn";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function Footer() {
    return (
        <Suspense>
            <SuspendedFooter />
        </Suspense>
    );
}

function SuspendedFooter() {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <footer className={cn("flex flex-col items-center justify-center gap-2", "px-4 py-12")}>
            <h2 className="text-2xl font-bold">Nextjs Deploy</h2>
            <p>A ready to deploy application template.</p>
            <Link href="/contact" label="Nous contacter" colors="link" className="text-sm text-gray-500">
                Nous contacter
            </Link>
        </footer>
    );
}
