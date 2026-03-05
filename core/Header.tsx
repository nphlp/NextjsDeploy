import MenuProfile from "@comps/molecules/menu-profile";
import MenuTheme from "@comps/molecules/menu-theme";
import cn from "@lib/cn";
import { HEADER_HEIGHT } from "./config";
import DesktopNavigation from "./header/desktop-navigation";
import DevSidebarTrigger from "./header/dev-sidebar-trigger";
import MobileNavigation from "./header/mobile-navigation";

type HeaderProps = {
    className?: string;
};

export default function Header(props: HeaderProps) {
    const { className } = props;

    return (
        <header
            style={{ height: `${HEADER_HEIGHT}rem` }}
            className={cn(
                "bg-background",
                "sticky inset-x-0 top-0 z-10",
                "flex items-center justify-end gap-4",
                "px-4 py-3 md:px-7",
                className,
            )}
        >
            {/* Mobile */}
            <div className="xs:hidden flex w-full gap-4">
                <MobileNavigation />
                <DevSidebarTrigger />
            </div>

            {/* Tablette & Desktop */}
            <div className="max-xs:hidden flex w-full justify-end gap-2">
                <DevSidebarTrigger />
                <DesktopNavigation />
            </div>

            <MenuProfile />
            <MenuTheme />
        </header>
    );
}
