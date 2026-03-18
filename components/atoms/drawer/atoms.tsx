/**
 * @see https://base-ui.com/react/components/drawer
 */
import { BaseUiProps, ButtonAttributes, ButtonStyleProps, LegacyProps, StandardAttributes } from "@atoms/types";
import { DrawerPreview as DrawerBaseUi } from "@base-ui/react/drawer";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { buttonStyle } from "../button/button-variants";

export type DrawerProps = {
    children?: ReactNode;
} & ComponentProps<typeof DrawerBaseUi.Root>;

export const Root = (props: DrawerProps) => {
    const { children, ...otherProps } = props;

    return <DrawerBaseUi.Root {...otherProps}>{children}</DrawerBaseUi.Root>;
};

type DrawerTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof DrawerBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: DrawerTriggerProps) => {
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
        <DrawerBaseUi.Trigger
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Trigger>
    );
};

type DrawerBackdropProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DrawerBaseUi.Backdrop, StandardAttributes>;

export const Backdrop = (props: DrawerBackdropProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Backdrop
            className={cn(
                // Layout
                "fixed inset-0 z-10 min-h-dvh supports-[-webkit-touch-callout:none]:absolute",
                // Background
                "bg-black opacity-[calc(0.2*(1-var(--drawer-swipe-progress)))]",
                // Animation
                "transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "data-ending-style:opacity-0 data-starting-style:opacity-0",
                "data-swiping:duration-0",
                "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
                // Dark
                "dark:opacity-[calc(0.7*(1-var(--drawer-swipe-progress)))]",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};

type DrawerPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof DrawerBaseUi.Portal>;

export const Portal = (props: DrawerPortalProps) => {
    const { children, ...otherProps } = props;

    return <DrawerBaseUi.Portal {...otherProps}>{children}</DrawerBaseUi.Portal>;
};

export type DrawerViewportProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DrawerBaseUi.Viewport, StandardAttributes>;

export const Viewport = (props: DrawerViewportProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Viewport
            className={cn(
                // Layout
                "[--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]",
                "fixed inset-0 z-10 flex items-stretch justify-end p-(--viewport-padding)",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Viewport>
    );
};

export type DrawerPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DrawerBaseUi.Popup, StandardAttributes>;

export const Popup = (props: DrawerPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Popup
            className={cn(
                // Layout
                "[--bleed:3rem] supports-[-webkit-touch-callout:none]:[--bleed:0px]",
                "h-full w-92 max-w-[calc(100vw-3rem+3rem)]",
                "-mr-12 p-6 pr-18",
                "touch-auto overflow-y-auto overscroll-contain",
                // iOS
                "supports-[-webkit-touch-callout:none]:mr-0",
                "supports-[-webkit-touch-callout:none]:w-[20rem]",
                "supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)]",
                "supports-[-webkit-touch-callout:none]:rounded-[10px]",
                "supports-[-webkit-touch-callout:none]:pr-6",
                // Border
                "outline-1 outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Animation
                "transform-[translateX(var(--drawer-swipe-movement-x))]",
                "transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "data-starting-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]",
                "data-ending-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]",
                "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
                "data-swiping:select-none",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Popup>
    );
};

type DrawerTitleProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DrawerBaseUi.Title, StandardAttributes>;

export const Title = (props: DrawerTitleProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Title
            className={cn(
                // Layout
                "-mt-1.5 mb-1",
                // Text
                "text-lg font-medium -tracking-[0.0025em]",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Title>
    );
};

type DrawerDescriptionProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DrawerBaseUi.Description, StandardAttributes>;

export const Description = (props: DrawerDescriptionProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Description
            className={cn(
                // Layout
                "mb-6",
                // Text
                "text-base text-gray-600",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Description>
    );
};

export type DrawerContentProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DrawerBaseUi.Content, StandardAttributes>;

export const Content = (props: DrawerContentProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Content
            className={cn(
                // Layout
                "mx-auto w-full max-w-lg",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Content>
    );
};

type DrawerCloseProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof DrawerBaseUi.Close, ButtonAttributes>;

export const Close = (props: DrawerCloseProps) => {
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
        <DrawerBaseUi.Close
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Close>
    );
};
