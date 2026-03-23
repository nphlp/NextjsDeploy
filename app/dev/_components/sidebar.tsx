"use client";

import Drawer, {
    Backdrop,
    Content,
    DragHandle,
    Popup,
    Portal,
    SnapContent,
    SnapPopup,
    SnapViewport,
    Viewport,
} from "@atoms/drawer";
import DrawerSnapPoints from "@atoms/drawer/drawer-snap-points";
import { HEADER_HEIGHT } from "@core/config";
import useDevSidebar from "@core/header/use-dev-sidebar";
import cn from "@lib/cn";
import useBreakpoint, { Breakpoint } from "@utils/use-breakpoint";
import { CSSProperties } from "react";
import SidebarNav from "./sidebar-nav";

const TOP_MARGIN_REM = 1;

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

            {/* Tablet (sm–lg): modal drawer from left */}
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

            {/* Mobile (< sm): snap-points drawer */}
            {!isSm && !isLg && (
                <DrawerSnapPoints open={open} onOpenChange={setOpen}>
                    <Portal>
                        <Backdrop />
                        <SnapViewport>
                            <SnapPopup
                                legacyProps={{ style: { "--top-margin": `${TOP_MARGIN_REM}rem` } as CSSProperties }}
                            >
                                <DragHandle />
                                <SnapContent>
                                    <SidebarNav onLinkClick={close} />
                                </SnapContent>
                            </SnapPopup>
                        </SnapViewport>
                    </Portal>
                </DrawerSnapPoints>
            )}
        </>
    );
}
