"use client";

import { Select as SelectBaseUi, SelectRootChangeEventDetails } from "@base-ui/react/select";
import cn from "@lib/cn";
import { CheckIcon, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { ReactNode } from "react";

export type ItemType = {
    [key: string]: string;
};

export type SelectedItemType = string | string[] | null;

export type SetSelectedItemType = (value: SelectedItemType, eventDetails: SelectRootChangeEventDetails) => void;

export const Root = (props: {
    selected?: SelectedItemType;
    onSelect?: SetSelectedItemType;
    multiple?: boolean;
    children: ReactNode;
}) => {
    const { selected, onSelect, multiple, children } = props;

    return (
        <SelectBaseUi.Root value={selected} onValueChange={onSelect} multiple={multiple}>
            {children}
        </SelectBaseUi.Root>
    );
};

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

export const Portal = (props: { children: ReactNode }) => {
    const { children } = props;

    return <SelectBaseUi.Portal>{children}</SelectBaseUi.Portal>;
};

export const Positioner = (props: {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignItemWithTrigger?: boolean;
    children: ReactNode;
}) => {
    const { sideOffset = 8, side = "bottom", align = "center", alignItemWithTrigger = false, children } = props;

    return (
        <SelectBaseUi.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignItemWithTrigger={alignItemWithTrigger}
            className={cn("z-10 outline-none select-none")}
        >
            {children}
        </SelectBaseUi.Positioner>
    );
};

export const Trigger = (props: { className?: string; children: ReactNode }) => {
    const { className, children } = props;

    return (
        <SelectBaseUi.Trigger
            className={cn(
                // Layout
                "flex min-h-10 max-w-60 min-w-36 items-center justify-between gap-3 py-1.5 pr-3 pl-3.5",
                // Border
                "rounded-md border border-gray-200",
                "focus-visible:outline-outline focus-visible:outline-2 focus-visible:-outline-offset-1",
                // Background
                "bg-background hover:bg-gray-100 data-popup-open:bg-gray-100",
                // Text
                "text-base text-gray-900 select-none",
                // Form Field state
                "group-data-disabled/field:bg-gray-50",
                "group-data-invalid/field:border-red-800",
                className,
            )}
        >
            {children}
            <SelectBaseUi.Icon className="flex">
                <ChevronsUpDown className="size-4" />
            </SelectBaseUi.Icon>
        </SelectBaseUi.Trigger>
    );
};

export const Value = (props: { children?: ReactNode | ((value: SelectedItemType) => ReactNode) }) => {
    const { children } = props;

    return <SelectBaseUi.Value className="text-start">{children}</SelectBaseUi.Value>;
};

export const Popup = (props: { withScrollArrows?: boolean; children: ReactNode }) => {
    const { withScrollArrows = false, children } = props;

    return (
        <SelectBaseUi.Popup
            className={cn(
                // Layout
                "group min-w-(--anchor-width) origin-(--transform-origin)",
                "data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]",
                // Border
                "rounded-md outline outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background bg-clip-padding",
                // Text
                "text-gray-900",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
                "data-[side=none]:data-ending-style:transition-none",
                "data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none",
            )}
        >
            <ScrollArrow visible={withScrollArrows} direction="up" />
            {children}
            <ScrollArrow visible={withScrollArrows} direction="down" />
        </SelectBaseUi.Popup>
    );
};

export const ScrollArrow = (props: { visible: boolean; direction: "up" | "down" }) => {
    const { visible, direction } = props;

    if (!visible) return null;

    const Component = direction === "up" ? SelectBaseUi.ScrollUpArrow : SelectBaseUi.ScrollDownArrow;
    const Icon = direction === "up" ? ChevronUp : ChevronDown;

    return (
        <Component
            className={cn(
                // Layout
                "z-1 flex h-5 w-full items-center justify-center",
                "before:absolute before:left-0 before:h-full before:w-full",
                direction === "up"
                    ? "top-0 data-[side=none]:before:-top-full"
                    : "bottom-0 data-[side=none]:before:-bottom-full",
                // Border
                "rounded-md",
                // Background
                "bg-background",
                // Text
                "cursor-default text-center text-xs before:content-['']",
            )}
        >
            <Icon className="size-5" />
        </Component>
    );
};

export const List = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <SelectBaseUi.List
            className={cn(
                // Layout
                "relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1",
            )}
        >
            {children}
        </SelectBaseUi.List>
    );
};

export const Separator = (props: { className?: string }) => {
    const { className } = props;

    return <SelectBaseUi.Separator className={cn("mx-4 my-1.5 h-px bg-gray-200", className)} />;
};

export const Group = (props: { label: string; children: ReactNode; className?: string }) => {
    const { label, children, className } = props;

    return (
        <SelectBaseUi.Group>
            <SelectBaseUi.GroupLabel
                className={cn("cursor-default py-2 pr-8 pl-6.5 text-sm leading-4 text-gray-500 select-none", className)}
            >
                {label}
            </SelectBaseUi.GroupLabel>
            {children}
        </SelectBaseUi.Group>
    );
};

export const Placeholder = (props: { label: string; className?: string }) => {
    const { label, className } = props;

    return (
        <SelectBaseUi.Item
            value={null}
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
        >
            <SelectBaseUi.ItemIndicator className="col-start-1">
                <CheckIcon className="size-4" />
            </SelectBaseUi.ItemIndicator>
            <SelectBaseUi.ItemText className="col-start-2">{label}</SelectBaseUi.ItemText>
        </SelectBaseUi.Item>
    );
};
export const Item = (props: { label: string; itemKey: string; className?: string }) => {
    const { label, itemKey, className } = props;

    return (
        <SelectBaseUi.Item
            value={itemKey}
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
        >
            <SelectBaseUi.ItemIndicator className="col-start-1">
                <CheckIcon className="size-4" />
            </SelectBaseUi.ItemIndicator>
            <SelectBaseUi.ItemText className="col-start-2">{label}</SelectBaseUi.ItemText>
        </SelectBaseUi.Item>
    );
};
