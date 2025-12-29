"use client";

import { Menu as MenuBaseUi } from "@base-ui/react/menu";
import cn from "@lib/cn";
import { CheckIcon, ChevronDown, ChevronRightIcon, CircleSmallIcon } from "lucide-react";
import { ReactNode } from "react";

export const Root = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        // This `div` prevents "space-y-*" layout shifting when the menu popup is opened
        // caused BaseUI creates `span` children elements to listen behaviors
        <div>
            <MenuBaseUi.Root>{children}</MenuBaseUi.Root>
        </div>
    );
};

export const Trigger = (
    props: { className?: string; openOnHover?: boolean } & (
        | { label: string; children?: undefined }
        | { label?: undefined; children: ReactNode }
    ),
) => {
    const { label, children, className, openOnHover = false } = props;

    return (
        <MenuBaseUi.Trigger
            openOnHover={openOnHover}
            className={cn(
                // Layout
                "flex h-10 items-center justify-center gap-1.5 px-3.5",
                // Border
                "rounded-md border border-gray-200",
                "focus-visible:outline-outline focus-visible:outline-2 focus-visible:-outline-offset-1",
                // Background
                "bg-gray-50 hover:bg-gray-100 active:bg-gray-100 data-popup-open:bg-gray-100",
                // Text
                "text-base font-medium text-gray-900 select-none",
                className,
            )}
        >
            {children}
            {label && (
                <>
                    <span>{label}</span>
                    <ChevronDown className="-mr-1 size-4" />
                </>
            )}
        </MenuBaseUi.Trigger>
    );
};

export const Portal = (props: { children: ReactNode }) => {
    const { children } = props;

    return <MenuBaseUi.Portal>{children}</MenuBaseUi.Portal>;
};

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

export const Positioner = (props: { children: ReactNode; sideOffset?: number; side?: Side; align?: Align }) => {
    const { children, sideOffset = 8, side = "bottom", align = "center" } = props;

    return (
        <MenuBaseUi.Positioner className="z-10 outline-none" sideOffset={sideOffset} side={side} align={align}>
            {children}
        </MenuBaseUi.Positioner>
    );
};

export const Popup = (props: { popoverWithoutArrow?: boolean; children: ReactNode; className?: string }) => {
    const { popoverWithoutArrow = false, children, className } = props;

    return (
        <MenuBaseUi.Popup
            className={cn(
                // Layout
                "origin-(--transform-origin) py-1",
                // Border
                "rounded-md outline-1 outline-gray-200",
                "dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-gray-900",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
                className,
            )}
        >
            {!popoverWithoutArrow && <Arrow />}
            {children}
        </MenuBaseUi.Popup>
    );
};

export const Arrow = () => {
    return (
        <MenuBaseUi.Arrow
            className={cn(
                // Position selon le côté
                "data-[side=bottom]:-top-2",
                "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
                "data-[side=left]:-right-3.25 data-[side=left]:rotate-90",
                "data-[side=right]:-left-3.25 data-[side=right]:-rotate-90",
            )}
        >
            <ArrowSvg />
        </MenuBaseUi.Arrow>
    );
};

export const ArrowSvg = (props: React.ComponentProps<"svg">) => {
    return (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
            <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                className="fill-background"
            />
            <path
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                className="fill-gray-200 dark:fill-none"
            />
            <path
                d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                className="dark:fill-gray-300"
            />
        </svg>
    );
};

export const ButtonItem = (
    props: { value: string; onItemClick?: (value: string) => void; className?: string } & (
        | { label: string; children?: undefined }
        | { label?: undefined; children: ReactNode }
    ),
) => {
    const { label, value, onItemClick, children, className } = props;

    return (
        <MenuBaseUi.Item
            onClick={() => onItemClick?.(value)}
            className={cn(
                // Layout
                "flex gap-3 py-2 pr-8 pl-4",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
                className,
            )}
        >
            {children}
            {label}
        </MenuBaseUi.Item>
    );
};

export const Separator = () => {
    return <MenuBaseUi.Separator className="mx-4 my-1.5 h-px bg-gray-200" />;
};

export const CheckboxItem = (props: {
    label: string;
    checked?: boolean;
    setCheckedChange?: (checked: boolean) => void;
    defaultChecked?: boolean;
}) => {
    const { label, checked, setCheckedChange, defaultChecked } = props;

    return (
        <MenuBaseUi.CheckboxItem
            checked={checked}
            onCheckedChange={setCheckedChange}
            defaultChecked={defaultChecked}
            className={cn(
                // Layout
                "grid grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-8 pl-2.5",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
            )}
        >
            <MenuBaseUi.CheckboxItemIndicator className="col-start-1">
                <CheckIcon className="size-4" />
            </MenuBaseUi.CheckboxItemIndicator>
            <span className="col-start-2">{label}</span>
        </MenuBaseUi.CheckboxItem>
    );
};

export const RadioSet = (props: {
    selectedRadio?: string;
    setSelectedRadio?: (value: string) => void;
    defaultValue?: string;
    children: ReactNode;
}) => {
    const { selectedRadio, setSelectedRadio, defaultValue, children } = props;

    return (
        <MenuBaseUi.RadioGroup value={selectedRadio} onValueChange={setSelectedRadio} defaultValue={defaultValue}>
            {children}
        </MenuBaseUi.RadioGroup>
    );
};

export const RadioItem = (props: { label: string; value: string; displayUnselectedIcon?: boolean }) => {
    const { label, value, displayUnselectedIcon = false } = props;

    return (
        <MenuBaseUi.RadioItem
            value={value}
            className={cn(
                "group",
                // Layout
                "grid grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-8 pl-2.5",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
            )}
        >
            {/* Unselected icon (hidden when checked via group) */}
            {displayUnselectedIcon && <CircleSmallIcon className="col-start-1 size-4 group-data-checked:hidden" />}

            {/* Selected icon */}
            <MenuBaseUi.RadioItemIndicator className="col-start-1">
                <CircleSmallIcon className="fill-foreground size-4 group-data-highlighted:fill-gray-50" />
            </MenuBaseUi.RadioItemIndicator>
            <span className="col-start-2">{label}</span>
        </MenuBaseUi.RadioItem>
    );
};

export const Group = (props: { label: string; children: ReactNode }) => {
    const { label, children } = props;

    return (
        <MenuBaseUi.Group>
            <MenuBaseUi.GroupLabel className="cursor-default py-2 pr-8 pl-7.5 text-sm leading-4 text-gray-600 select-none">
                {label}
            </MenuBaseUi.GroupLabel>
            {children}
        </MenuBaseUi.Group>
    );
};

export const SubMenu = (props: { children: ReactNode }) => {
    const { children } = props;

    return <MenuBaseUi.SubmenuRoot>{children}</MenuBaseUi.SubmenuRoot>;
};

export const SubTrigger = (props: { label: string; className?: string; openOnHover?: boolean }) => {
    const { label } = props;

    return (
        <MenuBaseUi.SubmenuTrigger
            className={cn(
                // Layout
                "flex items-center justify-between gap-4 py-2 pr-4 pl-4",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                "data-popup-open:relative data-popup-open:z-0",
                "data-popup-open:before:absolute data-popup-open:before:inset-x-1 data-popup-open:before:inset-y-0 data-popup-open:before:z-[-1]",
                // Border
                "outline-none",
                "data-highlighted:before:rounded-sm",
                "data-popup-open:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                "data-popup-open:before:bg-gray-100",
                "data-highlighted:data-popup-open:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
            )}
        >
            {label} <ChevronRightIcon className="size-4" />
        </MenuBaseUi.SubmenuTrigger>
    );
};

export const SubPortal = (props: { children: ReactNode }) => {
    const { children } = props;

    return <MenuBaseUi.Portal>{children}</MenuBaseUi.Portal>;
};

export const SubPositioner = (props: { children: ReactNode; sideOffset?: number }) => {
    const { children, sideOffset = 4 } = props;

    const getSubmenuOffset = ({ side }: { side: MenuBaseUi.Positioner.Props["side"] }) => {
        return side === "top" || side === "bottom" ? sideOffset : -sideOffset;
    };

    return (
        <MenuBaseUi.Positioner
            className="z-10 outline-none"
            sideOffset={getSubmenuOffset}
            alignOffset={getSubmenuOffset}
        >
            {children}
        </MenuBaseUi.Positioner>
    );
};

export const SubPopup = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <MenuBaseUi.Popup
            className={cn(
                // Layout
                "origin-(--transform-origin) py-1",
                // Border
                "rounded-md outline-1 outline-gray-200",
                "dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-gray-900",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
            )}
        >
            {children}
        </MenuBaseUi.Popup>
    );
};
