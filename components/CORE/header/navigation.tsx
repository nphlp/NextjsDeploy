"use client";

import { cn } from "@comps/SHADCN/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkType = {
    label: string;
    href: Route;
};

const links: LinkType[] = [
    { label: "Home", href: "/" },
    { label: "Tasks", href: "/task" },
];

type NavigationProps = {
    scrollToTop?: boolean;
};

export default function Navigation(props: NavigationProps) {
    const { scrollToTop = false } = props;

    const path = usePathname();

    const handleNativation = () => {
        const mainEl = document.querySelector("main");
        if (scrollToTop && mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex gap-2">
            {links.map(({ href, label }) => (
                <Link
                    key={label}
                    aria-label={label}
                    href={href}
                    onNavigate={handleNativation}
                    className={cn("text-lg", path === href && "font-bold")}
                >
                    {label}
                </Link>
            ))}
        </div>
    );
}
