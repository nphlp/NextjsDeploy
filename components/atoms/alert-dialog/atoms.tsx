/**
 * @see https://base-ui.com/react/components/alert-dialog
 */
"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { AlertDialog as AlertDialogBaseUi } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode, createContext, useContext } from "react";
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
                // Layout — `body` has `position: relative` (set in
                // `app/layout.tsx`) so Base UI's iOS 26+ progressive
                // enhancement can cover the visual viewport behind the
                // liquid-glass URL bar. The `supports-[-webkit-touch-callout:none]:absolute`
                // + `min-h-dvh` switch is a defensive fallback for older
                // WebKit builds where `position: fixed` is clipped to the
                // visual viewport (Backdrop wouldn't reach below the chrome).
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
    /** Visualize Header / Content / Footer regions with colored backgrounds. Dev only. */
    debug?: boolean;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Popup, StandardAttributes>;

/** Propagates the Popup `debug` flag down to Header / Content / Footer so they
 *  can paint their region with a colored background — useful when tuning
 *  paddings and gaps inside a long composed alert dialog. */
const AlertDialogDebugContext = createContext(false);

export const Popup = (props: AlertDialogPopupProps) => {
    const { className, children, legacyProps, debug = false, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Popup
            className={cn(
                // Edge gutter — mirrors `useCollisionPadding` (16/28) so the popup
                // never overflows the page gutter even with very wide content
                // (Base UI's `collisionPadding` only shifts, it doesn't resize).
                "max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-3.5rem)]",
                // Vertical cap — keeps the popup inside the viewport on every
                // device. `<Content>`'s `flex-1 min-h-0 overflow-y-auto` then
                // takes care of scrolling when the inner content overflows
                // (e.g. a long Terms of Service in a confirmation alert).
                "max-h-[calc(100dvh-8rem)]",
                // Layout — perfectly centered (no `-mt-*` offset).
                "fixed top-1/2 left-1/2 z-10 flex w-96 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden",
                // Border
                "rounded-lg p-4 outline-1 outline-gray-200",
                // Background — kept on the popup so macOS rubber-band on
                // `<Content>`'s scroll never reveals transparency behind the
                // bouncing content.
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
            <AlertDialogDebugContext.Provider value={debug}>{children}</AlertDialogDebugContext.Provider>
        </AlertDialogBaseUi.Popup>
    );
};

/**
 * Optional sticky top region above `<Content>`. Stays fixed while the body
 * scrolls. Holds the title / description / close button. Carries only
 * top + horizontal padding so `<Content>`'s own padding handles the
 * separation — no double padding between Header and Content.
 */
type AlertDialogHeaderProps = {
    className?: string;
    children?: ReactNode;
};

export const Header = (props: AlertDialogHeaderProps) => {
    const { className, children } = props;
    const debug = useContext(AlertDialogDebugContext);
    return <div className={cn("flex flex-col gap-2 pb-4", debug && "bg-blue-100", className)}>{children}</div>;
};

/**
 * Required scrollable inner region — the only child that can grow beyond
 * the popup's `max-h`, with `overflow-y-auto` enabling scroll.
 * `flex-1 min-h-0` makes it fill the remaining vertical space inside the
 * popup. Owns the full inner padding (`p-4 sm:p-6`); when `<Header>` /
 * `<Footer>` siblings exist, they only carry the outer-edge padding so
 * the rhythm stays uniform (16 / 24 px on every side).
 */
type AlertDialogContentProps = {
    className?: string;
    children?: ReactNode;
};

export const Content = (props: AlertDialogContentProps) => {
    const { className, children } = props;
    const debug = useContext(AlertDialogDebugContext);
    return (
        <div className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto", debug && "bg-green-100", className)}>
            {children}
        </div>
    );
};

/**
 * Optional sticky bottom region below `<Content>`. Stays fixed while the
 * body scrolls. Holds the action buttons (Cancel / Confirm / …).
 * Default `flex justify-end gap-2` matches the "buttons on the right"
 * pattern; override `className` for split layouts. Carries only bottom +
 * horizontal padding — `<Content>` handles the separation above.
 */
type AlertDialogFooterProps = {
    className?: string;
    children?: ReactNode;
};

export const Footer = (props: AlertDialogFooterProps) => {
    const { className, children } = props;
    const debug = useContext(AlertDialogDebugContext);
    return (
        <div className={cn("flex items-center justify-end gap-2 pt-4", debug && "bg-pink-100", className)}>
            {children}
        </div>
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
                // Text
                "text-base font-medium",
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
