import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { DrawerPreview as DrawerBaseUi } from "@base-ui/react/drawer";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

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
} & BaseUiProps<typeof DrawerBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: DrawerTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-foreground cursor-pointer text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-0 active:bg-gray-100",
                // Overrides
                className,
            )}
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

type DrawerViewportProps = {
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
                "fixed inset-0 z-10 flex justify-end",
                "supports-[-webkit-touch-callout:none]:p-2.5",
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

type DrawerPopupProps = {
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
                "box-border h-full w-80 max-w-[calc(100vw-3rem)] overflow-y-auto overscroll-contain p-6",
                // Border
                "outline-1 outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Animation
                "transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "transform-[translateX(var(--drawer-swipe-movement-x))]",
                "data-ending-style:translate-x-full data-starting-style:translate-x-full",
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

type DrawerCloseProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof DrawerBaseUi.Close, ButtonAttributes>;

export const Close = (props: DrawerCloseProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Close
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-foreground cursor-pointer text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-0 active:bg-gray-100",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DrawerBaseUi.Close>
    );
};
