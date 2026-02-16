import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { Dialog as DialogBaseUi } from "@base-ui/react/dialog";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

export type DialogProps = {
    children?: ReactNode;
} & ComponentProps<typeof DialogBaseUi.Root>;

export const Root = (props: DialogProps) => {
    const { children, ...otherProps } = props;

    return <DialogBaseUi.Root {...otherProps}>{children}</DialogBaseUi.Root>;
};

type DialogTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof DialogBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: DialogTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DialogBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-foreground text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-100",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DialogBaseUi.Trigger>
    );
};

type DialogBackdropProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DialogBaseUi.Backdrop, StandardAttributes>;

export const Backdrop = (props: DialogBackdropProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <DialogBaseUi.Backdrop
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

type DialogPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof DialogBaseUi.Portal>;

export const Portal = (props: DialogPortalProps) => {
    const { children, ...otherProps } = props;

    return <DialogBaseUi.Portal {...otherProps}>{children}</DialogBaseUi.Portal>;
};

type DialogPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DialogBaseUi.Popup, StandardAttributes>;

export const Popup = (props: DialogPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DialogBaseUi.Popup
            className={cn(
                // Layout
                "fixed top-1/2 left-1/2 z-10 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 p-6",
                // Border
                "rounded-lg outline-1 outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Animation
                "transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DialogBaseUi.Popup>
    );
};

type DialogTitleProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DialogBaseUi.Title, StandardAttributes>;

export const Title = (props: DialogTitleProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DialogBaseUi.Title
            className={cn(
                // Layout
                "-mt-1.5 mb-1",
                // Text
                "text-lg font-medium",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DialogBaseUi.Title>
    );
};

type DialogDescriptionProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof DialogBaseUi.Description, StandardAttributes>;

export const Description = (props: DialogDescriptionProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DialogBaseUi.Description
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
        </DialogBaseUi.Description>
    );
};

type DialogCloseProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof DialogBaseUi.Close, ButtonAttributes>;

export const Close = (props: DialogCloseProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <DialogBaseUi.Close
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-foreground text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-100",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </DialogBaseUi.Close>
    );
};
