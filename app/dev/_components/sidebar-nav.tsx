"use client";

import { Link } from "@atoms/button";
import cn from "@lib/cn";
import { BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { devLinkGroups } from "../_config/links";

type SidebarNavProps = {
    onLinkClick?: () => void;
};

export default function SidebarNav(props: SidebarNavProps) {
    const { onLinkClick } = props;
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-5">
            {/* Docs hub link */}
            <Link
                href="/dev"
                label="Docs"
                noStyle
                colors="ghost"
                className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm",
                    "hover:bg-gray-50",
                    pathname === "/dev" && "bg-gray-100 font-bold",
                )}
                legacyProps={{ onClick: onLinkClick }}
            >
                <BookOpen className="size-4 shrink-0" />
                Docs
            </Link>

            {/* Grouped links */}
            {devLinkGroups.map(({ label: groupLabel, links }) => (
                <div key={groupLabel} className="flex flex-col gap-1">
                    <span className="px-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                        {groupLabel}
                    </span>
                    {links.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href || (href !== "/dev" && pathname.startsWith(href as string));

                        return (
                            <Link
                                key={label}
                                href={href}
                                label={label}
                                noStyle
                                colors="ghost"
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm",
                                    "hover:bg-gray-50",
                                    isActive && "bg-gray-100 font-bold",
                                )}
                                legacyProps={{ onClick: onLinkClick }}
                            >
                                <Icon className="size-4 shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
