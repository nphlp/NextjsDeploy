"use client";

import { Session } from "@lib/authServer";
import { cn } from "@shadcn/lib/utils";
import { startsWith } from "lodash";
import { usePathname } from "next/navigation";
import ProfileIcon from "./header/profile";
import ThemeDropdown from "./header/theme";

type HeaderProps = {
    headerHeight: number;
    className?: string;
    serverSession: Session | null;
};

export default function Header(props: HeaderProps) {
    const { headerHeight, className, serverSession } = props;

    const path = usePathname();

    if (startsWith(path, "/dashboard")) return null;

    return (
        <header
            style={{ height: `${headerHeight}rem` }}
            className={cn(
                "bg-background",
                "sticky inset-x-0 top-0",
                "flex items-center justify-end gap-4",
                "px-5 py-3",
                className,
            )}
        >
            <ProfileIcon serverSession={serverSession} />
            <ThemeDropdown />
        </header>
    );
}
