import { Session } from "@lib/auth-server";
import { Apple, Home, LucideIcon, Wrench } from "lucide-react";
import { Route } from "next";

/**
 * Height relative to font-size
 * -> 16px x 4rem = 64px
 */
export const HEADER_HEIGHT = 4;

/**
 * Debug layout colors
 * -> Use `/layout` page to see the colored layout
 */
export const DEBUG_LAYOUT = false;

export type LinkType = {
    label: string;
    href: Route;
    icon: LucideIcon;

    // Displaying conditions
    sessionRequired?: boolean;
    developmentOnly?: boolean;
    adminOnly?: boolean;
    devOrAdmin?: boolean;
};

/**
 * Header navigation links configuration
 */
export const links: LinkType[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Fruits", href: "/fruits", icon: Apple },
    { label: "Dev", href: "/dev", icon: Wrench, devOrAdmin: true },
];

export const linksToRender = (props: { session: Session; isDev: boolean; isAdmin: boolean }) => {
    const { session, isDev, isAdmin } = props;
    return links.filter(({ sessionRequired, developmentOnly, adminOnly, devOrAdmin }) => {
        if (sessionRequired && !session) return false;
        if (developmentOnly && !isDev) return false;
        if (adminOnly && !isAdmin) return false;
        if (devOrAdmin && !isDev && !isAdmin) return false;
        return true;
    });
};
