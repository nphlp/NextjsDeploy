"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { Combobox as ComboboxBaseUi } from "@base-ui/react/combobox";
import cn from "@lib/cn";
import { Check, ChevronDown, X } from "lucide-react";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

export type ComboboxProps = {
    children?: ReactNode;
} & ComponentProps<typeof ComboboxBaseUi.Root>;

export const Root = (props: ComboboxProps) => {
    const { children, ...otherProps } = props;

    return <ComboboxBaseUi.Root {...otherProps}>{children}</ComboboxBaseUi.Root>;
};

type ComboboxInputProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Input, StandardAttributes>;

export const Input = (props: ComboboxInputProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Input
            className={cn(
                // Layout
                "h-10 w-64 rounded-md pr-14 pl-3.5",
                // Border
                "border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-foreground text-base font-normal",
                // State
                "focus:outline-outline focus:outline-2 focus:outline-offset-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};

type ComboboxTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof ComboboxBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: ComboboxTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-10 w-6 items-center justify-center rounded bg-transparent p-0",
                // Text
                "cursor-pointer text-gray-600",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children ?? <ChevronDown className="size-3" />}
        </ComboboxBaseUi.Trigger>
    );
};

type ComboboxPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof ComboboxBaseUi.Portal>;

export const Portal = (props: ComboboxPortalProps) => {
    const { children, ...otherProps } = props;

    return <ComboboxBaseUi.Portal {...otherProps}>{children}</ComboboxBaseUi.Portal>;
};

type ComboboxPositionerProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Positioner, StandardAttributes>;

export const Positioner = (props: ComboboxPositionerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Positioner
            className={cn("outline-none", className)}
            sideOffset={8}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Positioner>
    );
};

type ComboboxPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Popup, StandardAttributes>;

export const Popup = (props: ComboboxPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Popup
            className={cn(
                // Layout
                "max-h-92 w-(--anchor-width) max-w-(--available-width)",
                // Border
                "rounded-md",
                "outline-1 outline-gray-200 dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "origin-(--transform-origin)",
                "transition-[transform,scale,opacity] duration-100",
                "data-ending-style:scale-95 data-ending-style:opacity-0",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Popup>
    );
};

type ComboboxListProps = {
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: ReactNode | ((item: any) => ReactNode);

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.List, StandardAttributes>;

export const List = (props: ComboboxListProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.List
            className={cn(
                // Layout
                "max-h-[min(23rem,var(--available-height))] scroll-py-2 overflow-y-auto overscroll-contain py-2 outline-0",
                "data-empty:p-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.List>
    );
};

type ComboboxItemProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Item, StandardAttributes>;

export const Item = (props: ComboboxItemProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Item
            className={cn(
                // Layout
                "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-8 pl-4",
                // Text
                "text-base leading-4 outline-none select-none",
                // State
                "data-highlighted:relative data-highlighted:z-0 data-highlighted:text-gray-50",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0",
                "data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-gray-900",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Item>
    );
};

type ComboboxItemIndicatorProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.ItemIndicator, StandardAttributes>;

export const ItemIndicator = (props: ComboboxItemIndicatorProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.ItemIndicator
            className={cn(
                // Layout
                "col-start-1",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children ?? <Check className="size-3" />}
        </ComboboxBaseUi.ItemIndicator>
    );
};

type ComboboxEmptyProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Empty, StandardAttributes>;

export const Empty = (props: ComboboxEmptyProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Empty
            className={cn(
                // Layout
                "p-4 empty:m-0 empty:p-0",
                // Text
                "text-[0.925rem] leading-4 text-gray-600",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children ?? "No results found"}
        </ComboboxBaseUi.Empty>
    );
};

type ComboboxClearProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof ComboboxBaseUi.Clear, ButtonAttributes>;

export const Clear = (props: ComboboxClearProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Clear
            className={cn(
                // Layout
                "flex h-10 w-6 items-center justify-center rounded bg-transparent p-0",
                // Text
                "text-gray-600",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children ?? <X className="size-3" />}
        </ComboboxBaseUi.Clear>
    );
};

type ComboboxChipsProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Chips, StandardAttributes>;

export const Chips = (props: ComboboxChipsProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Chips
            className={cn(
                // Layout
                "flex w-64 flex-wrap items-center gap-0.5 rounded-md px-1.5 py-1",
                // Border
                "border border-gray-200",
                // State
                "focus-within:outline-outline focus-within:outline-2 focus-within:outline-offset-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Chips>
    );
};

type ComboboxChipProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof ComboboxBaseUi.Chip, StandardAttributes>;

export const Chip = (props: ComboboxChipProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Chip
            className={cn(
                // Layout
                "flex cursor-default items-center gap-1 rounded-md px-1.5 py-[0.2rem]",
                // Background
                "bg-gray-100",
                // Text
                "text-foreground text-sm outline-none",
                // State
                "[@media(hover:hover)]:data-highlighted:bg-gray-900 [@media(hover:hover)]:data-highlighted:text-gray-50",
                "focus-within:bg-gray-900 focus-within:text-gray-50",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Chip>
    );
};

type ComboboxChipRemoveProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof ComboboxBaseUi.ChipRemove, ButtonAttributes>;

export const ChipRemove = (props: ComboboxChipRemoveProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <ComboboxBaseUi.ChipRemove
            className={cn(
                // Layout
                "rounded-md p-1",
                // Text
                "text-inherit",
                // State
                "hover:bg-gray-200",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children ?? <X className="size-3" />}
        </ComboboxBaseUi.ChipRemove>
    );
};
