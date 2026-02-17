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

type DrawerContentProps = {
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

// ─── Non-modal variants ──────────────────────────────────────────

export const NonModalViewport = (props: DrawerViewportProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Viewport
            className={cn(
                // Layout
                "[--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]",
                "fixed inset-0 z-10 flex items-stretch justify-end p-(--viewport-padding)",
                // Non-modal
                "pointer-events-none",
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

export const NonModalPopup = (props: DrawerPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Popup
            className={cn(
                // Layout
                "[--bleed:3rem] supports-[-webkit-touch-callout:none]:[--bleed:0px]",
                "h-full w-92 max-w-[calc(100vw-3rem+3rem)]",
                "-mr-12 p-6 pr-18",
                "touch-auto overflow-y-auto overscroll-contain",
                // Non-modal
                "pointer-events-auto",
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
                // Shadow
                "shadow-[0_-16px_48px_rgb(0_0_0/0.12),0_6px_18px_rgb(0_0_0/0.06)]",
                // Animation
                "transform-[translateX(var(--drawer-swipe-movement-x))]",
                "transition-[transform,box-shadow] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "data-starting-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]",
                "data-ending-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]",
                "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
                "data-starting-style:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)]",
                "data-ending-style:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)]",
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

// ─── Snap-point variants ─────────────────────────────────────────

export const SnapViewport = (props: DrawerViewportProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Viewport
            className={cn(
                // Layout
                "fixed inset-0 z-10 flex touch-none items-end justify-center",
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

export const SnapPopup = (props: DrawerPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Popup
            className={cn(
                // Layout
                "[--bleed:3rem]",
                "relative flex min-h-0 w-full flex-col",
                "max-h-[calc(100dvh-var(--top-margin))]",
                "touch-none overflow-visible rounded-t-2xl",
                // Snap-point offsets
                "pb-[max(0px,calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))]",
                "transform-[translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))]",
                // Border
                "outline-1 outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Shadow
                "shadow-[0_-16px_48px_rgb(0_0_0/0.12),0_6px_18px_rgb(0_0_0/0.06)]",
                // Animation
                "transition-[transform,box-shadow] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
                // After pseudo (bleed)
                "after:bg-background after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-(--bleed) after:content-['']",
                // Starting/ending styles
                "data-ending-style:transform-[translateY(100%)] data-starting-style:transform-[translateY(100%)]",
                "data-ending-style:pb-0 data-starting-style:pb-0",
                "data-starting-style:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)]",
                "data-ending-style:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)]",
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

type DragHandleProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
};

export const DragHandle = (props: DragHandleProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <div
            className={cn(
                // Layout
                "shrink-0 touch-none px-6 pt-3.5 pb-3",
                // Border
                "border-b border-gray-200 dark:border-gray-300",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            <div className="mx-auto h-1 w-12 rounded-full bg-gray-300" />
            {children}
        </div>
    );
};

export const SnapContent = (props: DrawerContentProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DrawerBaseUi.Content
            className={cn(
                // Layout
                "min-h-0 flex-1 touch-auto overflow-y-auto overscroll-contain",
                "px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]",
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
