"use client";

import { devLinkGroups } from "@app/dev/_config/links";
import { Link } from "@atoms/button";
import Button from "@atoms/button";
import { Root as Collapsible, Trigger as CollapsibleTrigger, Panel } from "@atoms/collapsible";
import Drawer, { Backdrop, Content, Popup, Portal, Viewport } from "@atoms/drawer";
import { useSession } from "@lib/auth-client";
import cn from "@lib/cn";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { linksToRender } from "../header-links";

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
                                    {/* Main navigation */}
                                    {links.map(({ href, label, icon: Icon }) => {
                                        const isDocsLink = href === "/dev";
                                        const isActive = pathname === href;

                                        // Docs link with collapsible (always shown, open by default on /dev pages)
                                        if (isDocsLink) {
                                            return (
                                                <Collapsible key={href} defaultOpen={isOnDev}>
                                                    <div
                                                        className={cn(
                                                            "group/row flex items-center rounded-md",
                                                            "transition-colors duration-100",
                                                            "[&:has(>a:hover)]:bg-gray-100",
                                                            isOnDev && "bg-gray-50",
                                                        )}
                                                    >
                                                        <Link
                                                            href={href}
                                                            label={label}
                                                            noStyle
                                                            className={cn(
                                                                "flex flex-1 items-center gap-3 rounded-l-md px-3 py-2.5 text-sm",
                                                                isActive && "font-bold",
                                                            )}
                                                            legacyProps={{ onClick: close }}
                                                        >
                                                            <Icon className="size-4 shrink-0" />
                                                            {label}
                                                        </Link>
                                                        <CollapsibleChevron active={isOnDev} />
                                                    </div>
                                                    <Panel>
                                                        <DocsLinks pathname={pathname} close={close} />
                                                    </Panel>
                                                </Collapsible>
                                            );
                                        }

                                        // Regular link
                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                label={label}
                                                noStyle
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                                                    "hover:bg-gray-100",
                                                    isActive && "bg-gray-50 font-bold",
                                                )}
                                                legacyProps={{ onClick: close }}
                                            >
                                                <Icon className="size-4 shrink-0" />
                                                {label}
                                            </Link>
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

function CollapsibleChevron(props: { active: boolean }) {
    const { active } = props;

    return (
        <CollapsibleTrigger
            padding="icon"
            colors="ghost"
            className={cn("group rounded-r-md", active && "border-transparent hover:border-gray-100 hover:bg-gray-100")}
        >
            <ChevronDown
                className={cn(
                    "size-4 transition-all duration-150 group-data-panel-open:rotate-180",
                    active
                        ? "text-gray-500 group-hover/row:text-gray-600"
                        : "text-gray-300 group-hover/row:text-gray-500",
                )}
            />
        </CollapsibleTrigger>
    );
}

function DocsLinks(props: { pathname: string; close: () => void }) {
    const { pathname, close } = props;

    return (
        <div className="mt-4 ml-5 flex flex-col gap-5 border-l border-gray-200 pl-3">
            {devLinkGroups.map(({ label: groupLabel, links: groupLinks }) => (
                <div key={groupLabel} className="flex flex-col gap-1">
                    <span className="px-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                        {groupLabel}
                    </span>
                    {groupLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== "/dev" && pathname.startsWith(href as string));

                        return (
                            <Link
                                key={label}
                                href={href}
                                label={label}
                                noStyle
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                                    "hover:bg-gray-100",
                                    isActive && "bg-gray-50 font-bold",
                                )}
                                legacyProps={{ onClick: close }}
                            >
                                <Icon className="size-4 shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
