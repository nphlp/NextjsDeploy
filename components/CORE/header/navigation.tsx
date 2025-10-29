"use client";

import { cn } from "@comps/SHADCN/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkType = {
    label: string;
    href: Route;
};

const links: LinkType[] = [{ label: "Tasks", href: "/tasks" }];

export default function Navigation() {
    const path = usePathname();

    return (
        <div className="flex gap-2 px-4">
            {links.map(({ href, label }) => (
                <Link
                    key={label}
                    aria-label={label}
                    href={href}
                    className={cn("text-lg", path === href && "font-bold")}
                >
                    {label}
                </Link>
            ))}
        </div>
    );
}
