import MenuNavigation from "@comps/molecules/menu-navigation";
import MenuProfile from "@comps/molecules/menu-profile";
import MenuTheme from "@comps/molecules/menu-theme";
import { getSession } from "@lib/auth-server";
import cn from "@lib/cn";
import { Suspense } from "react";
import { HEADER_HEIGHT } from "./config";

type HeaderProps = {
    className?: string;
};

export default async function Header(props: HeaderProps) {
    return (
        <Suspense fallback={<header style={{ height: `${HEADER_HEIGHT}rem` }} className="w-full" />}>
            <SuspendedHeader {...props} />
        </Suspense>
    );
}

const SuspendedHeader = async (props: HeaderProps) => {
    "use cache: private";

    const { className } = props;

    const session = await getSession();

    return (
        <header
            style={{ height: `${HEADER_HEIGHT}rem` }}
            className={cn(
                "bg-background",
                "sticky inset-x-0 top-0 z-10",
                "flex items-center justify-end gap-4",
                "px-5 py-3",
                className,
            )}
        >
            <MenuNavigation serverSession={session} />
            <MenuProfile serverSession={session} />
            <MenuTheme />
        </header>
    );
};
