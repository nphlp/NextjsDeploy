"use client";

import { Link } from "@atoms/button";
import { ButtonItem, Popup, Portal, Positioner, Trigger } from "@comps/atoms/menu/atoms";
import Menu from "@comps/atoms/menu/menu";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import cn from "@lib/cn";
import { Apple, Home, LucideIcon, Menu as MenuIcon, Wrench } from "lucide-react";
import { Route } from "next";
import { usePathname } from "next/navigation";

type LinkType = {
    label: string;
    href: Route;
    icon: LucideIcon;

    // Displaying conditions
    sessionRequired?: boolean;
    developmentOnly?: boolean;
    adminOnly?: boolean;
    devOrAdmin?: boolean;
};

const links: LinkType[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Fruits", href: "/fruits", icon: Apple },
    { label: "Dev", href: "/dev", icon: Wrench, devOrAdmin: true },
];

type MenuNavigationProps = {
    serverSession: Session | null;
};

export default function MenuNavigation(props: MenuNavigationProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending } = useSession();

    // SSR session
    const session = isPending ? serverSession : clientSession;

    const path = usePathname();

    const isDev = process.env.NODE_ENV === "development";
    const isAdmin = session?.user.role === "ADMIN";

    const linksToRender = links.filter(({ sessionRequired, developmentOnly, adminOnly, devOrAdmin }) => {
        if (sessionRequired && !session) return false;
        if (developmentOnly && !isDev) return false;
        if (adminOnly && !isAdmin) return false;
        if (devOrAdmin && !isDev && !isAdmin) return false;
        return true;
    });

    if (!linksToRender.length) return null;

    return (
        <>
            {/* Desktop: inline links */}
            <div className="max-xs:hidden flex gap-2">
                {linksToRender.map(({ href, label }) => (
                    <Link
                        label={label}
                        href={href}
                        key={label}
                        colors="ghost"
                        className={cn("text-lg", path === href && "font-bold")}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* Mobile: dropdown menu */}
            <div className="xs:hidden w-full">
                <Menu>
                    <Trigger className="border-none bg-transparent px-2 hover:bg-gray-100">
                        <MenuIcon className="size-6" />
                    </Trigger>
                    <Portal>
                        <Positioner align="start">
                            <Popup className="w-40">
                                {linksToRender.map(({ href, label, icon: Icon }) => (
                                    <Link label={label} key={href} href={href} className="w-full" noStyle>
                                        <ButtonItem value={href}>
                                            <Icon className="size-4" />
                                            <span className={cn(path === href && "font-bold")}>{label}</span>
                                        </ButtonItem>
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
