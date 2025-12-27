"use client";

import { cn } from "@comps/SHADCN/lib/utils";
import { Button, Popup, Portal, Positioner, Trigger } from "@comps/atoms/menu/atoms";
import Menu from "@comps/atoms/menu/menu";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { Menu as MenuIcon } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkType = {
    label: string;
    href: Route;

    // Displaying conditions
    developmentOnly?: boolean;
    sessionRequired?: boolean;
    adminOnly?: boolean;
};

const links: LinkType[] = [
    { label: "Home", href: "/" },
    { label: "Fruits", href: "/fruits" },
    { label: "UI", href: "/ui", developmentOnly: true },
    { label: "Tasks", href: "/tasks", sessionRequired: true },
    { label: "API", href: "/scalar", developmentOnly: true },
];

type MenuNavigationProps = {
    serverSession: Session | null;
};

export default function MenuNavigation(props: MenuNavigationProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending } = useSession();
    const session = isPending ? serverSession : clientSession;

    const path = usePathname();

    const linksToRender = links.filter(({ sessionRequired, developmentOnly, adminOnly }) => {
        // If no session is required, but session does not exist, skip
        if (sessionRequired && !session) return false;

        // If dev only, and not in dev env, skip
        if (developmentOnly && process.env.NODE_ENV !== "development") return false;

        // If admin only, and session user is not admin, skip
        if (adminOnly && session?.user.role !== "ADMIN") return false;

        return true;
    });

    if (!linksToRender.length) return null;

    return (
        <>
            {/* Desktop: inline links */}
            <div className="flex gap-8 px-4 max-sm:hidden">
                {linksToRender.map(({ href, label }) => (
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

            {/* Mobile: dropdown menu */}
            <div className="w-full sm:hidden">
                <Menu>
                    <Trigger className="border-none bg-transparent px-2 hover:bg-gray-100">
                        <MenuIcon className="size-6" />
                    </Trigger>
                    <Portal>
                        <Positioner align="start">
                            <Popup>
                                {linksToRender.map(({ href, label }) => (
                                    <Link key={href} href={href} aria-label={label}>
                                        <Button value={href}>
                                            <span className={cn(path === href && "font-bold")}>{label}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </Popup>
                        </Positioner>
                    </Portal>
                </Menu>
            </div>
        </>
    );
}
