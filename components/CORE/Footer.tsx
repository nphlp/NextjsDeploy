"use client";

import { startsWith } from "lodash";
import { usePathname } from "next/navigation";

export default function Footer() {
    const path = usePathname();

    if (startsWith(path, "/dashboard")) return null;

    return (
        <footer className="flex flex-col items-center justify-center gap-2 p-6">
            <h2 className="text-2xl font-bold">Pulse Work</h2>
            <p>Ce site web est réalisé dans le cadre d&apos;un projet étudiant.</p>
        </footer>
    );
}
