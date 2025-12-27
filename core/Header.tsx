import MenuNavigation from "@comps/molecule/menu-navigation";
import MenuProfile from "@comps/molecule/menu-profile";
import MenuTheme from "@comps/molecule/menu-theme";
import { getSession } from "@lib/auth-server";
import { cn } from "@shadcn/lib/utils";
import { Suspense } from "react";

type HeaderProps = {
    headerHeight: number;
    className?: string;
};

export default async function Header(props: HeaderProps) {
    const { headerHeight } = props;
    return (
        <Suspense fallback={<header style={{ height: `${headerHeight}rem` }} className="w-full" />}>
            <SuspendedHeader {...props} />
        </Suspense>
    );
}

const SuspendedHeader = async (props: HeaderProps) => {
    "use cache: private";

    const { headerHeight, className } = props;

    const session = await getSession();

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
            <MenuNavigation serverSession={session} />
            <MenuProfile serverSession={session} />
            <MenuTheme />
        </header>
    );
};
