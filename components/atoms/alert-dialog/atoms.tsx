/**
 * @see https://base-ui.com/react/components/alert-dialog
 */
import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { AlertDialog as AlertDialogBaseUi } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { ButtonStyleProps, buttonStyle } from "../_core/button-variants";

export type AlertDialogProps = {
    children?: ReactNode;
} & ComponentProps<typeof AlertDialogBaseUi.Root>;

export const Root = (props: AlertDialogProps) => {
    const { children, ...otherProps } = props;

    return <AlertDialogBaseUi.Root {...otherProps}>{children}</AlertDialogBaseUi.Root>;
};

type AlertDialogTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof AlertDialogBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: AlertDialogTriggerProps) => {
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
        <AlertDialogBaseUi.Trigger
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Trigger>
    );
};

type AlertDialogBackdropProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Backdrop, StandardAttributes>;

export const Backdrop = (props: AlertDialogBackdropProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Backdrop
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

type AlertDialogPortalProps = {
    children?: ReactNode;
} & ComponentProps<typeof AlertDialogBaseUi.Portal>;

export const Portal = (props: AlertDialogPortalProps) => {
    const { children, ...otherProps } = props;

    return <AlertDialogBaseUi.Portal {...otherProps}>{children}</AlertDialogBaseUi.Portal>;
};

type AlertDialogPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Popup, StandardAttributes>;

export const Popup = (props: AlertDialogPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Popup
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
        </AlertDialogBaseUi.Popup>
    );
};

type AlertDialogTitleProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Title, StandardAttributes>;

export const Title = (props: AlertDialogTitleProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Title
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
        </AlertDialogBaseUi.Title>
    );
};

type AlertDialogDescriptionProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Description, StandardAttributes>;

export const Description = (props: AlertDialogDescriptionProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Description
            className={cn(
                // Layout
                "mb-6",
                // Text
                "text-sm text-gray-600",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Description>
    );
};

type AlertDialogCloseProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof AlertDialogBaseUi.Close, ButtonAttributes>;

export const Close = (props: AlertDialogCloseProps) => {
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
        <AlertDialogBaseUi.Close
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Close>
    );
};
