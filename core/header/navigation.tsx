"use client";

import Link from "@comps/SHADCN/components/link";
import { cn } from "@comps/SHADCN/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@comps/SHADCN/ui/dropdown-menu";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { Menu } from "lucide-react";
import { Route } from "next";
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
    { label: "Tasks", href: "/tasks", sessionRequired: true },
    { label: "API", href: "/scalar", developmentOnly: true },
];

type NavigationProps = {
    serverSession: Session | null;
};

export default function Navigation(props: NavigationProps) {
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
            <div className="flex gap-8 px-4 max-sm:hidden">
                {linksToRender.map(({ href, label }) => (
                    <Link
                        key={label}
                        aria-label={label}
                        href={href}
                        className={cn("text-lg", path === href && "font-bold")}
                        noStyle
                    >
                        {label}
                    </Link>
                ))}
            </div>
            <div className="w-full sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-foreground hover:bg-accent hover:text-foreground cursor-pointer rounded-md p-2">
                        <Menu className="size-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start" className="min-w-[140px]">
                        {linksToRender.map(({ href, label }) => (
                            <DropdownMenuItem key={href} asChild>
                                <Link href={href} aria-label={label} className="w-full" noStyle>
                                    {label}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
