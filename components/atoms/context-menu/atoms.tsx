/**
 * @see https://base-ui.com/react/components/context-menu
 */

"use client";

import { ContextMenu as ContextMenuBaseUi } from "@base-ui/react/context-menu";
import cn from "@lib/cn";
import { ChevronRight } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

export type ContextMenuProps = {
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.Root>;

export const Root = (props: ContextMenuProps) => {
    const { children, ...otherProps } = props;

    return <ContextMenuBaseUi.Root {...otherProps}>{children}</ContextMenuBaseUi.Root>;
};

type ContextMenuTriggerProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.Trigger>;

export const Trigger = (props: ContextMenuTriggerProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ContextMenuBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-48 w-60 items-center justify-center",
                // Border
                "rounded-md border border-gray-300",
                // Text
                "text-foreground select-none",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </ContextMenuBaseUi.Trigger>
    );
};

type ContextMenuPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.Portal>;

export const Portal = (props: ContextMenuPortalProps) => {
    const { children, ...otherProps } = props;

    return <ContextMenuBaseUi.Portal {...otherProps}>{children}</ContextMenuBaseUi.Portal>;
};

type ContextMenuPositionerProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.Positioner>;

export const Positioner = (props: ContextMenuPositionerProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ContextMenuBaseUi.Positioner className={cn("z-10 outline-none", className)} {...otherProps}>
            {children}
        </ContextMenuBaseUi.Positioner>
    );
};

type ContextMenuPopupProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.Popup>;

export const Popup = (props: ContextMenuPopupProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ContextMenuBaseUi.Popup
            className={cn(
                // Layout
                "origin-(--transform-origin) py-1",
                // Border
                "rounded-md outline-1 outline-gray-200",
                "dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-opacity",
                "data-ending-style:opacity-0",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </ContextMenuBaseUi.Popup>
    );
};

const itemClasses = cn(
    // Layout
    "flex cursor-default py-2 pr-8 pl-4",
    "data-highlighted:relative data-highlighted:z-0",
    "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
    // Border
    "outline-none data-highlighted:before:rounded-sm",
    // Background
    "data-highlighted:before:bg-gray-900",
    // Text
    "text-sm leading-4 select-none",
    "data-highlighted:text-gray-50",
);

type ContextMenuItemProps = {
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
} & ComponentProps<typeof ContextMenuBaseUi.Item>;

export const Item = (props: ContextMenuItemProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ContextMenuBaseUi.Item className={cn(itemClasses, className)} {...otherProps}>
            {children}
        </ContextMenuBaseUi.Item>
    );
};

type ContextMenuSeparatorProps = {
    className?: string;
} & ComponentProps<typeof ContextMenuBaseUi.Separator>;

export const Separator = (props: ContextMenuSeparatorProps) => {
    const { className, ...otherProps } = props;

    return <ContextMenuBaseUi.Separator className={cn("mx-4 my-1.5 h-px bg-gray-200", className)} {...otherProps} />;
};

type ContextMenuSubmenuRootProps = {
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.SubmenuRoot>;

export const SubmenuRoot = (props: ContextMenuSubmenuRootProps) => {
    const { children, ...otherProps } = props;

    return <ContextMenuBaseUi.SubmenuRoot {...otherProps}>{children}</ContextMenuBaseUi.SubmenuRoot>;
};

type ContextMenuSubmenuTriggerProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof ContextMenuBaseUi.SubmenuTrigger>;

export const SubmenuTrigger = (props: ContextMenuSubmenuTriggerProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ContextMenuBaseUi.SubmenuTrigger
            className={cn(
                itemClasses,
                // Layout
                "items-center justify-between gap-4 pr-4",
                // Submenu open state
                "data-popup-open:relative data-popup-open:z-0",
                "data-popup-open:before:absolute data-popup-open:before:inset-x-1 data-popup-open:before:inset-y-0 data-popup-open:before:z-[-1]",
                "data-popup-open:before:rounded-sm data-popup-open:before:bg-gray-100",
                "data-highlighted:data-popup-open:before:bg-gray-900",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children} <ChevronRight className="size-4" />
        </ContextMenuBaseUi.SubmenuTrigger>
    );
};
