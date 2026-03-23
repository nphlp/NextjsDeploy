import { Drawer as DrawerBaseUi } from "@base-ui/react/drawer";
import cn from "@lib/cn";
import { DrawerPopupProps, DrawerViewportProps } from "./atoms";

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
