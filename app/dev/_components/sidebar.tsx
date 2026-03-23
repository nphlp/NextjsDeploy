"use client";

import Drawer, { Backdrop, Content, Popup, Portal, Viewport } from "@atoms/drawer";
import { HEADER_HEIGHT } from "@core/config";
import useDevSidebar from "@core/header/use-dev-sidebar";
import cn from "@lib/cn";
import useBreakpoint, { Breakpoint } from "@utils/use-breakpoint";
import SidebarNav from "./sidebar-nav";

const lgBreakpoints = new Set<Breakpoint>(["lg", "xl", "2xl", "3xl"]);
const smBreakpoints = new Set<Breakpoint>(["sm", "md"]);

export default function Sidebar() {
    const breakpoint = useBreakpoint();
    const { open, setOpen } = useDevSidebar();

    const close = () => setOpen(false);

    const isLg = lgBreakpoints.has(breakpoint);
    const isSm = smBreakpoints.has(breakpoint);

    return (
        <>
            {/* Desktop: sticky sidebar with independent scroll */}
            <aside
                style={{ top: `${HEADER_HEIGHT}rem`, height: `calc(100dvh - ${HEADER_HEIGHT}rem)` }}
                className={cn("hidden lg:block", "sticky w-60 flex-none overflow-y-auto py-7 pl-7")}
            >
                <SidebarNav />
            </aside>

            {/* Tablet (sm–lg): drawer from left */}
            {isSm && (
                <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
                    <Portal>
                        <Backdrop />
                        <Viewport className="justify-start">
                            <Popup
                                className={cn(
                                    "mr-0 -ml-12 pr-6 pl-18",
                                    "transform-[translateX(var(--drawer-swipe-movement-x))]",
                                    "data-starting-style:transform-[translateX(calc(-100%+var(--bleed)-var(--viewport-padding)))]",
                                    "data-ending-style:transform-[translateX(calc(-100%+var(--bleed)-var(--viewport-padding)))]",
                                )}
                            >
                                <Content>
                                    <SidebarNav onLinkClick={close} />
                                </Content>
                            </Popup>
                        </Viewport>
                    </Portal>
                </Drawer>
            )}

            {/* Mobile (< sm): drawer from bottom */}
            {!isSm && !isLg && (
                <Drawer open={open} onOpenChange={setOpen}>
                    <Portal>
                        <Backdrop />
                        <Viewport className="items-end justify-center">
                            <Popup
                                className={cn(
                                    "h-auto w-full max-w-full rounded-t-2xl p-6",
                                    "mr-0 pr-6",
                                    "transform-[translateY(var(--drawer-swipe-movement-y))]",
                                    "data-starting-style:transform-[translateY(100%)]",
                                    "data-ending-style:transform-[translateY(100%)]",
                                )}
                            >
                                <Content>
                                    <SidebarNav onLinkClick={close} />
                                </Content>
                            </Popup>
                        </Viewport>
                    </Portal>
                </Drawer>
            )}
        </>
    );
}
