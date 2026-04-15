/**
 * @see https://base-ui.com/react/components/menu
 */

"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { Menu as MenuBaseUi } from "@base-ui/react/menu";
import cn from "@lib/cn";
import { Check } from "lucide-react";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { ButtonStyleProps, buttonStyle } from "../_core/button-variants";

export type MenuProps = {
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.Root>;

export const Root = (props: MenuProps) => {
    const { children, ...otherProps } = props;

    return (
        <div>
            <MenuBaseUi.Root {...otherProps}>{children}</MenuBaseUi.Root>
        </div>
    );
};

type MenuTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof MenuBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: MenuTriggerProps) => {
    const {
        className,
        children,
        // Style props
        colors = "outline",
        rounded = "md",
        padding = "md",
        noFlex = false,
        noOutline = false,
        noStyle = false,
        // Others
        legacyProps,
        ...otherProps
    } = props;

    return (
        <MenuBaseUi.Trigger
            className={cn(
                buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }),
                // Menu-specific overrides on top of buttonStyle
                "text-foreground cursor-default gap-1.5 data-popup-open:bg-gray-100",
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </MenuBaseUi.Trigger>
    );
};

type MenuPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.Portal>;

export const Portal = (props: MenuPortalProps) => {
    const { children, ...otherProps } = props;

    return <MenuBaseUi.Portal {...otherProps}>{children}</MenuBaseUi.Portal>;
};

type MenuPositionerProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof MenuBaseUi.Positioner, StandardAttributes>;

export const Positioner = (props: MenuPositionerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <MenuBaseUi.Positioner
            sideOffset={8}
            className={cn("z-10 outline-none", className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </MenuBaseUi.Positioner>
    );
};

type MenuPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof MenuBaseUi.Popup, StandardAttributes>;

export const Popup = (props: MenuPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

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
                "text-foreground",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </MenuBaseUi.Popup>
    );
};

type MenuArrowProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.Arrow>;

export const Arrow = (props: MenuArrowProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.Arrow
            className={cn(
                // Position
                "data-[side=bottom]:-top-2",
                "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
                "data-[side=left]:-right-3.25 data-[side=left]:rotate-90",
                "data-[side=right]:-left-3.25 data-[side=right]:-rotate-90",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children ?? <ArrowSvg />}
        </MenuBaseUi.Arrow>
    );
};

const itemClasses = cn(
    // Layout
    "flex cursor-default gap-3 py-2 pr-8 pl-4",
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

type MenuItemProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: () => void;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof MenuBaseUi.Item, StandardAttributes>;

export const Item = (props: MenuItemProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <MenuBaseUi.Item className={cn(itemClasses, className)} {...legacyProps} {...otherProps}>
            {children}
        </MenuBaseUi.Item>
    );
};

type MenuSeparatorProps = {
    className?: string;
} & ComponentProps<typeof MenuBaseUi.Separator>;

export const Separator = (props: MenuSeparatorProps) => {
    const { className, ...otherProps } = props;

    return <MenuBaseUi.Separator className={cn("mx-4 my-1.5 h-px bg-gray-200", className)} {...otherProps} />;
};

type MenuGroupProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.Group>;

export const Group = (props: MenuGroupProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.Group className={cn(className)} {...otherProps}>
            {children}
        </MenuBaseUi.Group>
    );
};

type MenuGroupLabelProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.GroupLabel>;

export const GroupLabel = (props: MenuGroupLabelProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.GroupLabel
            className={cn("cursor-default py-2 pr-8 pl-7.5 text-sm leading-4 text-gray-600 select-none", className)}
            {...otherProps}
        >
            {children}
        </MenuBaseUi.GroupLabel>
    );
};

const checkboxItemClasses = cn(
    // Layout
    "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-8 pl-2.5",
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

type MenuCheckboxItemProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.CheckboxItem>;

export const CheckboxItem = (props: MenuCheckboxItemProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.CheckboxItem className={cn(checkboxItemClasses, className)} {...otherProps}>
            {children}
        </MenuBaseUi.CheckboxItem>
    );
};

type MenuCheckboxItemIndicatorProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.CheckboxItemIndicator>;

export const CheckboxItemIndicator = (props: MenuCheckboxItemIndicatorProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.CheckboxItemIndicator className={cn("col-start-1", className)} {...otherProps}>
            {children ?? <Check className="size-4" />}
        </MenuBaseUi.CheckboxItemIndicator>
    );
};

type MenuRadioGroupProps = {
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.RadioGroup>;

export const RadioGroup = (props: MenuRadioGroupProps) => {
    const { children, ...otherProps } = props;

    return <MenuBaseUi.RadioGroup {...otherProps}>{children}</MenuBaseUi.RadioGroup>;
};

type MenuRadioItemProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.RadioItem>;

export const RadioItem = (props: MenuRadioItemProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.RadioItem className={cn(checkboxItemClasses, className)} {...otherProps}>
            {children}
        </MenuBaseUi.RadioItem>
    );
};

type MenuRadioItemIndicatorProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.RadioItemIndicator>;

export const RadioItemIndicator = (props: MenuRadioItemIndicatorProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.RadioItemIndicator className={cn("col-start-1", className)} {...otherProps}>
            {children ?? <Check className="size-4" />}
        </MenuBaseUi.RadioItemIndicator>
    );
};

type MenuSubmenuRootProps = {
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.SubmenuRoot>;

export const SubmenuRoot = (props: MenuSubmenuRootProps) => {
    const { children, ...otherProps } = props;

    return <MenuBaseUi.SubmenuRoot {...otherProps}>{children}</MenuBaseUi.SubmenuRoot>;
};

type MenuSubmenuTriggerProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof MenuBaseUi.SubmenuTrigger>;

export const SubmenuTrigger = (props: MenuSubmenuTriggerProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <MenuBaseUi.SubmenuTrigger
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
            {children}
        </MenuBaseUi.SubmenuTrigger>
    );
};

function ArrowSvg(props: React.ComponentProps<"svg">) {
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
}
