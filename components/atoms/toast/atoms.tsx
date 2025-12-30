"use client";

import { Toast as ToastBaseUi } from "@base-ui/react/toast";
import { Toast } from "@base-ui/react/toast";
import cn from "@lib/cn";
import { ComponentProps, ReactNode } from "react";

export const Provider = (props: { children: ReactNode }) => {
    const { children } = props;

    return <ToastBaseUi.Provider>{children}</ToastBaseUi.Provider>;
};

export const Portal = (props: { children: ReactNode }) => {
    const { children } = props;

    return <ToastBaseUi.Portal>{children}</ToastBaseUi.Portal>;
};

export const Viewport = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <ToastBaseUi.Viewport
            className={cn(
                // Layout
                "fixed top-auto right-4 bottom-4 z-10 mx-auto flex w-62.5",
                "sm:right-8 sm:bottom-8 sm:w-75",
            )}
        >
            {children}
        </ToastBaseUi.Viewport>
    );
};

export const Root = (props: { children: ReactNode } & ComponentProps<typeof ToastBaseUi.Root>) => {
    const { children, ...otherProps } = props;

    return (
        <ToastBaseUi.Root
            {...otherProps}
            className={cn(
                // Layout
                "absolute right-0 bottom-0 left-auto mr-0 w-full",
                "z-[calc(1000-var(--toast-index))]",
                "h-(--height) origin-bottom",
                // Border
                "rounded-lg border border-gray-200",
                // Background
                "bg-gray-50 bg-clip-padding",
                // Text
                "select-none",
                // Shadow
                "shadow-lg",
                // Spacing
                "p-4",
                // CSS Variables
                "[--gap:0.75rem]",
                "[--height:var(--toast-frontmost-height,var(--toast-height))]",
                "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
                "[--peek:0.75rem]",
                "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))]",
                "[--shrink:calc(1-var(--scale))]",
                // Transform
                "transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
                // Animation
                "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
                // Pseudo-elements
                "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
                // Data states - base
                "data-ending-style:opacity-0",
                "data-expanded:h-(--toast-height)",
                "data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]",
                "data-limited:opacity-0",
                "data-starting-style:transform-[translateY(150%)]",
                // Data states - swipe down
                "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
                "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
                // Data states - swipe left
                "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
                "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
                // Data states - swipe right
                "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
                "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
                // Data states - swipe up
                "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
                "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
                // Data states - fallback
                "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
            )}
        >
            {children}
        </ToastBaseUi.Root>
    );
};

export const Content = (props: { children: ReactNode } & ComponentProps<typeof ToastBaseUi.Content>) => {
    const { children, ...otherProps } = props;

    return (
        <Toast.Content
            className={cn(
                // Layout
                "overflow-hidden",
                // Animation
                "transition-opacity duration-250",
                // Data states
                "data-behind:pointer-events-none data-behind:opacity-0",
                "data-expanded:pointer-events-auto data-expanded:opacity-100",
            )}
            {...otherProps}
        >
            {children}
        </Toast.Content>
    );
};

export const Title = (props: ComponentProps<typeof ToastBaseUi.Title>) => {
    const { ...otherProps } = props;

    return (
        <Toast.Title
            className={cn(
                // Text
                "text-sm leading-5 font-medium",
            )}
            {...otherProps}
        />
    );
};

export const Description = (props: ComponentProps<typeof ToastBaseUi.Description>) => {
    const { ...otherProps } = props;

    return (
        <Toast.Description
            className={cn(
                // Text
                "text-xs leading-5 text-gray-700",
            )}
            {...otherProps}
        />
    );
};

export const Close = (props: { children: ReactNode } & ComponentProps<typeof ToastBaseUi.Close>) => {
    const { children, ...otherProps } = props;

    return (
        <Toast.Close
            aria-label="Close"
            className={cn(
                // Layout
                "absolute top-2 right-2 flex h-5 w-5 items-center justify-center",
                // Border
                "rounded border-none",
                // Background
                "bg-transparent hover:bg-gray-100",
                // Text
                "text-gray-500 hover:text-gray-700",
            )}
            {...otherProps}
        >
            {children}
        </Toast.Close>
    );
};
