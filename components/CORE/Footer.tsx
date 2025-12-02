"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <footer className="mt-20 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold">Nextjs Deploy</h2>
            <p>A ready to deploy application template</p>
        </footer>
    );
}
