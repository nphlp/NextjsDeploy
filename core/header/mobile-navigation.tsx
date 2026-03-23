"use client";

import { devLinkGroups } from "@app/dev/_config/links";
import Button from "@atoms/button";
import Drawer, { Backdrop, Content, Popup, Portal, Viewport } from "@atoms/drawer";
import { useSession } from "@lib/auth-client";
import cn from "@lib/cn";
import { Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { linksToRender } from "../header-links";
import { NavGroup, NavItem, NavSection } from "./nav-components";

export default function MobileNavigation() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isDev = process.env.NODE_ENV === "development";
    const isAdmin = session?.user.role === "ADMIN";
    const isOnDev = pathname.startsWith("/dev");

    const links = linksToRender({ session, isDev, isAdmin });

    const close = () => setOpen(false);

    return (
        <>
            <Button label="Open navigation" onClick={() => setOpen(true)} colors="ghost" padding="icon">
                <MenuIcon className="size-5" />
            </Button>

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
                                <nav className="flex flex-col gap-1">
                                    {links.map(({ href, label, icon }) => {
                                        // Docs: collapsible with sub-links
                                        if (href === "/dev") {
                                            return (
                                                <NavSection
                                                    key={href}
                                                    href={href}
                                                    label={label}
                                                    icon={icon}
                                                    active={isOnDev}
                                                    pathname={pathname}
                                                    onNavigate={close}
                                                >
                                                    {devLinkGroups.map(({ label: groupLabel, links: groupLinks }) => (
                                                        <NavGroup key={groupLabel} label={groupLabel}>
                                                            {groupLinks.map((link) => (
                                                                <NavItem
                                                                    key={link.href}
                                                                    href={link.href}
                                                                    label={link.label}
                                                                    icon={link.icon}
                                                                    pathname={pathname}
                                                                    onNavigate={close}
                                                                />
                                                            ))}
                                                        </NavGroup>
                                                    ))}
                                                </NavSection>
                                            );
                                        }

                                        // Regular link
                                        return (
                                            <NavItem
                                                key={href}
                                                href={href}
                                                label={label}
                                                icon={icon}
                                                pathname={pathname}
                                                onNavigate={close}
                                            />
                                        );
                                    })}
                                </nav>
                            </Content>
                        </Popup>
                    </Viewport>
                </Portal>
            </Drawer>
        </>
    );
}
