import { LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { Drawer as DrawerBaseUi } from "@base-ui/react/drawer";
import cn from "@lib/cn";
import { ReactNode } from "react";
import { DrawerContentProps, DrawerPopupProps, DrawerViewportProps } from "./atoms";

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
