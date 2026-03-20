/**
 * @see https://base-ui.com/react/components/select
 */

"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { Select as SelectBaseUi } from "@base-ui/react/select";
import cn from "@lib/cn";
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

export type SelectProps = {
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.Root>;

export const Root = (props: SelectProps) => {
    const { children, ...otherProps } = props;

    return <SelectBaseUi.Root {...otherProps}>{children}</SelectBaseUi.Root>;
};

type SelectTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof SelectBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: SelectTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SelectBaseUi.Trigger
            className={cn(
                // Layout
                "flex min-h-10 min-w-36 items-center justify-between gap-3 py-1.5 pr-3 pl-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Outline
                "outline-2 outline-transparent",
                "focus-visible:outline-outline",
                // Background
                "bg-background hover:bg-gray-100 data-popup-open:bg-gray-100",
                // Text
                "cursor-default text-base text-gray-900 select-none",
                // Form Field state
                "group-data-disabled/field:bg-gray-50",
                "group-data-invalid/field:border-red-800",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SelectBaseUi.Trigger>
    );
};

type SelectValueProps = {
    className?: string;
} & ComponentProps<typeof SelectBaseUi.Value>;

export const Value = (props: SelectValueProps) => {
    const { className, ...otherProps } = props;

    return <SelectBaseUi.Value className={cn("text-start", className)} {...otherProps} />;
};

type SelectIconProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.Icon>;

export const Icon = (props: SelectIconProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.Icon className={cn("flex", className)} {...otherProps}>
            {children ?? <ChevronsUpDown className="size-4" />}
        </SelectBaseUi.Icon>
    );
};

type SelectPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.Portal>;

export const Portal = (props: SelectPortalProps) => {
    const { children, ...otherProps } = props;

    return <SelectBaseUi.Portal {...otherProps}>{children}</SelectBaseUi.Portal>;
};

type SelectPositionerProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SelectBaseUi.Positioner, StandardAttributes>;

export const Positioner = (props: SelectPositionerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SelectBaseUi.Positioner
            sideOffset={8}
            className={cn("z-10 outline-none select-none", className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SelectBaseUi.Positioner>
    );
};

type SelectPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SelectBaseUi.Popup, StandardAttributes>;

export const Popup = (props: SelectPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SelectBaseUi.Popup
            className={cn(
                // Layout
                "group min-w-(--anchor-width) origin-(--transform-origin)",
                "data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]",
                // Border
                "rounded-md outline-1 outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background bg-clip-padding",
                // Text
                "text-foreground",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
                "data-[side=none]:data-ending-style:transition-none",
                "data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SelectBaseUi.Popup>
    );
};

const scrollArrowClasses = cn(
    // Layout
    "z-1 flex h-4 w-full items-center justify-center",
    "before:absolute before:left-0 before:h-full before:w-full before:content-['']",
    // Border
    "rounded-md",
    // Background
    "bg-background",
    // Text
    "cursor-default text-center text-xs",
);

type SelectScrollArrowProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.ScrollUpArrow>;

export const ScrollUpArrow = (props: SelectScrollArrowProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.ScrollUpArrow
            className={cn(scrollArrowClasses, "top-0 data-[side=none]:before:-top-full", className)}
            {...otherProps}
        >
            {children ?? <ChevronUp className="size-4" />}
        </SelectBaseUi.ScrollUpArrow>
    );
};

export const ScrollDownArrow = (props: SelectScrollArrowProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.ScrollDownArrow
            className={cn(scrollArrowClasses, "bottom-0 data-[side=none]:before:-bottom-full", className)}
            {...otherProps}
        >
            {children ?? <ChevronDown className="size-4" />}
        </SelectBaseUi.ScrollDownArrow>
    );
};

type SelectListProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SelectBaseUi.List, StandardAttributes>;

export const List = (props: SelectListProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SelectBaseUi.List
            className={cn(
                // Layout
                "relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SelectBaseUi.List>
    );
};

type SelectItemProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SelectBaseUi.Item, StandardAttributes>;

export const Item = (props: SelectItemProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SelectBaseUi.Item
            className={cn(
                // Layout
                "grid grid-cols-[1rem_1fr] items-center gap-2.5 py-2 pr-4 pl-3",
                "group-data-[side=none]:pr-12",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                "pointer-coarse:py-2.5",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "group-data-[side=none]:text-base group-data-[side=none]:leading-4",
                "data-highlighted:text-gray-50",
                "pointer-coarse:text-[0.925rem]",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SelectBaseUi.Item>
    );
};

type SelectItemIndicatorProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.ItemIndicator>;

export const ItemIndicator = (props: SelectItemIndicatorProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.ItemIndicator className={cn("col-start-1", className)} {...otherProps}>
            {children ?? <Check className="size-4" />}
        </SelectBaseUi.ItemIndicator>
    );
};

type SelectItemTextProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.ItemText>;

export const ItemText = (props: SelectItemTextProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.ItemText className={cn("col-start-2", className)} {...otherProps}>
            {children}
        </SelectBaseUi.ItemText>
    );
};

type SelectGroupProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.Group>;

export const Group = (props: SelectGroupProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.Group className={cn(className)} {...otherProps}>
            {children}
        </SelectBaseUi.Group>
    );
};

type SelectGroupLabelProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof SelectBaseUi.GroupLabel>;

export const GroupLabel = (props: SelectGroupLabelProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <SelectBaseUi.GroupLabel
            className={cn("cursor-default py-2 pr-8 pl-6.5 text-sm leading-4 text-gray-500 select-none", className)}
            {...otherProps}
        >
            {children}
        </SelectBaseUi.GroupLabel>
    );
};

type SelectSeparatorProps = {
    className?: string;
} & ComponentProps<typeof SelectBaseUi.Separator>;

export const Separator = (props: SelectSeparatorProps) => {
    const { className, ...otherProps } = props;

    return <SelectBaseUi.Separator className={cn("mx-4 my-1.5 h-px bg-gray-200", className)} {...otherProps} />;
};
