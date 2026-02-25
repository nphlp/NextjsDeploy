"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { Tooltip as TooltipBaseUi } from "@base-ui/react/tooltip";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

export type TooltipProviderProps = ComponentProps<typeof TooltipBaseUi.Provider>;

export const Provider = (props: TooltipProviderProps) => {
    return <TooltipBaseUi.Provider {...props} />;
};

export type TooltipProps = {
    children?: ReactNode;
} & ComponentProps<typeof TooltipBaseUi.Root>;

export const Root = (props: TooltipProps) => {
    const { children, ...otherProps } = props;

    return <TooltipBaseUi.Root {...otherProps}>{children}</TooltipBaseUi.Root>;
};

type TooltipTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof TooltipBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: TooltipTriggerProps) => {
    const { className, children, delay = 100, legacyProps, ...otherProps } = props;

    return (
        <TooltipBaseUi.Trigger
            delay={delay}
            className={cn(
                // Layout
                "flex items-center justify-center p-2",
                // Border
                "rounded-sm border-0",
                // Background
                "bg-transparent",
                // Text
                "text-foreground select-none",
                // State
                "hover:bg-gray-50",
                "data-popup-open:bg-gray-50",
                "focus-visible:outline-outline focus-visible:outline-2 focus-visible:outline-offset-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </TooltipBaseUi.Trigger>
    );
};

type TooltipPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof TooltipBaseUi.Portal>;

export const Portal = (props: TooltipPortalProps) => {
    const { children, ...otherProps } = props;

    return <TooltipBaseUi.Portal {...otherProps}>{children}</TooltipBaseUi.Portal>;
};

type TooltipPositionerProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TooltipBaseUi.Positioner, StandardAttributes>;

export const Positioner = (props: TooltipPositionerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TooltipBaseUi.Positioner sideOffset={10} className={cn(className)} {...legacyProps} {...otherProps}>
            {children}
        </TooltipBaseUi.Positioner>
    );
};

type TooltipPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TooltipBaseUi.Popup, StandardAttributes>;

export const Popup = (props: TooltipPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TooltipBaseUi.Popup
            className={cn(
                // Layout
                "flex flex-col px-2 py-1",
                // Border
                "rounded-md",
                "outline-1 outline-gray-200 dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-sm",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "origin-(--transform-origin)",
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
                "data-instant:transition-none",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </TooltipBaseUi.Popup>
    );
};

type TooltipArrowProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TooltipBaseUi.Arrow, StandardAttributes>;

export const Arrow = (props: TooltipArrowProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TooltipBaseUi.Arrow
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
        </TooltipBaseUi.Arrow>
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
