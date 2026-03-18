/**
 * @see https://base-ui.com/react/components/popover
 */

"use client";

import { BaseUiProps, ButtonAttributes, ButtonStyleProps, LegacyProps, StandardAttributes } from "@atoms/types";
import { Popover as PopoverBaseUi } from "@base-ui/react/popover";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { buttonStyle } from "../button/button-variants";

export type PopoverProps = {
    children?: ReactNode;
} & ComponentProps<typeof PopoverBaseUi.Root>;

export const Root = (props: PopoverProps) => {
    const { children, ...otherProps } = props;

    return <PopoverBaseUi.Root {...otherProps}>{children}</PopoverBaseUi.Root>;
};

type PopoverTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof PopoverBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: PopoverTriggerProps) => {
    const {
        className,
        children,
        // Style props
        colors = "outline",
        rounded = "md",
        padding = "icon",
        noFlex = false,
        noOutline = false,
        noStyle = false,
        // Others
        legacyProps,
        ...otherProps
    } = props;

    return (
        <PopoverBaseUi.Trigger
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </PopoverBaseUi.Trigger>
    );
};

type PopoverBackdropProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Backdrop, StandardAttributes>;

export const Backdrop = (props: PopoverBackdropProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Backdrop
            className={cn(
                // Layout
                "fixed inset-0 z-10 min-h-dvh supports-[-webkit-touch-callout:none]:absolute",
                // Background
                "bg-black opacity-20 dark:opacity-70",
                // Animation
                "transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};

type PopoverPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof PopoverBaseUi.Portal>;

export const Portal = (props: PopoverPortalProps) => {
    const { children, ...otherProps } = props;

    return <PopoverBaseUi.Portal {...otherProps}>{children}</PopoverBaseUi.Portal>;
};

type PopoverPositionerProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Positioner, StandardAttributes>;

export const Positioner = (props: PopoverPositionerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Positioner sideOffset={8} className={cn(className)} {...legacyProps} {...otherProps}>
            {children}
        </PopoverBaseUi.Positioner>
    );
};

type PopoverPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Popup, StandardAttributes>;

export const Popup = (props: PopoverPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Popup
            className={cn(
                // Layout
                "px-6 py-4",
                // Border
                "rounded-lg",
                "outline-1 outline-gray-200 dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "origin-(--transform-origin)",
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
        </PopoverBaseUi.Popup>
    );
};

type PopoverArrowProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Arrow, StandardAttributes>;

export const Arrow = (props: PopoverArrowProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Arrow
            className={cn(
                // Position
                "data-[side=bottom]:-top-2",
                "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
                "data-[side=left]:-right-3.25 data-[side=left]:rotate-90",
                "data-[side=right]:-left-3.25 data-[side=right]:-rotate-90",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children ?? <ArrowSvg />}
        </PopoverBaseUi.Arrow>
    );
};

type PopoverViewportProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Viewport, StandardAttributes>;

export const Viewport = (props: PopoverViewportProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Viewport className={cn(className)} {...legacyProps} {...otherProps}>
            {children}
        </PopoverBaseUi.Viewport>
    );
};

type PopoverTitleProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Title, StandardAttributes>;

export const Title = (props: PopoverTitleProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Title
            className={cn(
                // Text
                "text-base font-medium",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </PopoverBaseUi.Title>
    );
};

type PopoverDescriptionProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof PopoverBaseUi.Description, StandardAttributes>;

export const Description = (props: PopoverDescriptionProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <PopoverBaseUi.Description
            className={cn(
                // Text
                "text-base text-gray-600",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </PopoverBaseUi.Description>
    );
};

type PopoverCloseProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof PopoverBaseUi.Close, ButtonAttributes>;

export const Close = (props: PopoverCloseProps) => {
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
        <PopoverBaseUi.Close
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </PopoverBaseUi.Close>
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
