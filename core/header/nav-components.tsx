"use client";

import { Link } from "@atoms/button";
import { Root as Collapsible, Trigger as CollapsibleTrigger, Panel } from "@atoms/collapsible";
import cn from "@lib/cn";
import { ChevronDown, LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";

// ─── NavItem ────────────────────────────────────────────────

type NavItemProps = {
    href: string;
    label: string;
    icon: LucideIcon;
    pathname: string;
    onNavigate?: () => void;
};

export function NavItem(props: NavItemProps) {
    const { href, label, icon: Icon, pathname, onNavigate } = props;
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            label={label}
            noStyle
            className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                "hover:bg-gray-100",
                isActive && "bg-gray-50 font-bold",
            )}
            legacyProps={{ onClick: onNavigate }}
        >
            <Icon className="size-4 shrink-0" />
            {label}
        </Link>
    );
}

// ─── NavSection (collapsible) ───────────────────────────────

type NavSectionProps = {
    href: string;
    label: string;
    icon: LucideIcon;
    active: boolean;
    pathname: string;
    onNavigate?: () => void;
    children: ReactNode;
};

export function NavSection(props: NavSectionProps) {
    const { href, label, icon: Icon, active, pathname, onNavigate, children } = props;
    const isExact = pathname === href;
    const [open, setOpen] = useState(active);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <div
                className={cn(
                    "group/row flex items-center rounded-md",
                    "transition-colors duration-100",
                    "[&:has(>a:hover)]:bg-gray-100",
                    active && "bg-gray-50",
                )}
            >
                <Link
                    href={href}
                    label={label}
                    noStyle
                    className={cn(
                        "flex flex-1 items-center gap-3 rounded-l-md px-3 py-2.5 text-sm",
                        isExact && "font-bold",
                    )}
                    legacyProps={{ onClick: onNavigate }}
                >
                    <Icon className="size-4 shrink-0" />
                    {label}
                </Link>
                <CollapsibleTrigger
                    padding="icon"
                    colors="ghost"
                    className={cn(
                        "group rounded-r-md",
                        active && "border-transparent hover:border-gray-100 hover:bg-gray-100",
                    )}
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
            </div>
            <Panel>
                <div className="mt-2 ml-5 flex flex-col gap-5 border-l border-gray-200 pl-3">{children}</div>
            </Panel>
        </Collapsible>
    );
}

// ─── NavGroup ───────────────────────────────────────────────

type NavGroupProps = {
    label: string;
    children: ReactNode;
};

export function NavGroup(props: NavGroupProps) {
    const { label, children } = props;

    return (
        <div className="flex flex-col gap-1">
            <span className="px-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">{label}</span>
            {children}
        </div>
    );
}
