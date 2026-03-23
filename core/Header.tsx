"use client";

import MenuProfile from "@comps/molecules/menu-profile";
import MenuTheme from "@comps/molecules/menu-theme";
import cn from "@lib/cn";
import { useSyncExternalStore } from "react";
import { HEADER_HEIGHT } from "./config";
import DesktopNavigation from "./header/desktop-navigation";
import DevSidebarTrigger from "./header/dev-sidebar-trigger";
import MobileNavigation from "./header/mobile-navigation";

const scrollStore = (() => {
    const subscribe = (cb: () => void) => {
        window.addEventListener("scroll", cb, { passive: true });
        return () => window.removeEventListener("scroll", cb);
    };
    const getSnapshot = () => window.scrollY > 0;
    const getServerSnapshot = () => false;
    return { subscribe, getSnapshot, getServerSnapshot };
})();

export default function Header() {
    const scrolled = useSyncExternalStore(
        scrollStore.subscribe,
        scrollStore.getSnapshot,
        scrollStore.getServerSnapshot,
    );

    return (
        <header
            style={{ height: `${HEADER_HEIGHT}rem` }}
            className={cn(
                "bg-background",
                "sticky inset-x-0 top-0 z-10",
                "flex items-center justify-end gap-4",
                "px-4 py-3 md:px-7",
                "border-b transition-colors duration-200",
                scrolled ? "border-gray-200" : "border-transparent",
            )}
        >
            {/* Mobile */}
            <div className="xs:hidden flex w-full gap-4">
                <MobileNavigation />
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
