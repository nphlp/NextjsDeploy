"use client";

import { Link } from "@atoms/button";
import { ButtonItem, Popup, Portal, Positioner, Trigger } from "@comps/atoms/menu/atoms";
import Menu from "@comps/atoms/menu/menu";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import cn from "@lib/cn";
import { Apple, Code, Combine, Copy, Home, ListTodo, LucideIcon, Menu as MenuIcon, Palette } from "lucide-react";
import { Route } from "next";
import { usePathname } from "next/navigation";

type LinkType = {
    label: string;
    href: Route;
    icon: LucideIcon;

    // Displaying conditions
    developmentOnly?: boolean;
    sessionRequired?: boolean;
    adminOnly?: boolean;
};

const links: LinkType[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Fruits", href: "/fruits", icon: Apple },
    { label: "Tasks", href: "/tasks", icon: ListTodo, sessionRequired: true },
    { label: "UI", href: "/theme/ui", icon: Combine },
    { label: "Skeleton", href: "/theme/skeleton", icon: Copy },
    { label: "Colors", href: "/theme/colors", icon: Palette },
    { label: "API", href: "/scalar", icon: Code, developmentOnly: true },
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
            <div className="flex gap-2 max-md:hidden">
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
            <div className="w-full md:hidden">
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
