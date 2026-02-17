"use client";

import { Link } from "@atoms/button";
import { linksToRender } from "@core/header-links";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import cn from "@lib/cn";
import { usePathname } from "next/navigation";

type DesktopNavigationProps = {
    serverSession: Session | null;
};

export default function DesktopNavigation(props: DesktopNavigationProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending } = useSession();

    const path = usePathname();

    // SSR session
    const session = isPending ? serverSession : clientSession;
    const isDev = process.env.NODE_ENV === "development";
    const isAdmin = session?.user.role === "ADMIN";

    const links = linksToRender({ session, isDev, isAdmin });

    return (
        <div className="flex gap-2">
            {links.map(({ href, label }) => (
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
    );
}
