"use client";

import {
    Backdrop,
    Content,
    DragHandle,
    Popup,
    Portal,
    SnapContent,
    SnapPopup,
    SnapViewport,
    Viewport,
} from "@atoms/drawer/atoms";
import Drawer from "@atoms/drawer/drawer";
import DrawerSnapPoints from "@atoms/drawer/drawer-snap-points";
import cn from "@lib/cn";
import useDevSidebarStore from "@utils/stores/dev-sidebar-store";
import useBreakpoint, { Breakpoint } from "@utils/use-breakpoint";
import { CSSProperties } from "react";
import SidebarNav from "./sidebar-nav";

const TOP_MARGIN_REM = 1;

const lgBreakpoints = new Set<Breakpoint>(["lg", "xl", "2xl", "3xl"]);
const smBreakpoints = new Set<Breakpoint>(["sm", "md"]);

export default function Sidebar() {
    const breakpoint = useBreakpoint();
    const { open, setOpen } = useDevSidebarStore();

    const close = () => setOpen(false);

    const isLg = lgBreakpoints.has(breakpoint);
    const isSm = smBreakpoints.has(breakpoint);

    return (
        <>
            {/* Desktop: static sidebar */}
            <aside className={cn("hidden lg:block", "w-60 flex-none py-7 pl-7")}>
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
