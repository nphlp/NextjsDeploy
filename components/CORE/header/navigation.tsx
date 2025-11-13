"use client";

import { cn } from "@comps/SHADCN/lib/utils";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
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
    { label: "Tasks", href: "/tasks", sessionRequired: true },
    { label: "Examples", href: "/examples" },
    { label: "Scalar", href: "/scalar", developmentOnly: true },
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

    return (
        <div className="flex gap-8 px-4">
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
    );
}
