import ButtonAtom from "@atoms/button/button";
import LinkAtom from "@atoms/button/link";
import cn from "@lib/cn";
import type { ComponentProps, ReactNode } from "react";
import cardVariants, { type CardColorsType } from "./card-variants";

/**
 * Card root — positioned container with color variants. Required as the
 * nearest positioned ancestor so `Link` / `Button` overlays can extend
 * their click zone via `::after`.
 */
export type RootProps = {
    colors?: CardColorsType;
    className?: string;
    children?: ReactNode;
};

export const Root = (props: RootProps) => {
    const { colors, className, children } = props;
    return <div className={cn(cardVariants({ colors }), className)}>{children}</div>;
};

/**
 * Overlay link — extends its click zone to the whole `Root` via
 * `after:absolute after:inset-0`. The link itself stays in the flow and
 * renders its children normally.
 *
 * Tagged with `data-card-overlay` so the parent `Root` activates hover
 * styles via `has-data-card-overlay:hover:*`.
 */
export const Link = (props: ComponentProps<typeof LinkAtom>) => {
    const { className, ...otherProps } = props;
    return (
        <LinkAtom
            data-card-overlay
            noStyle
            noOutline
            {...otherProps}
            className={cn("static after:absolute after:inset-0", className)}
        />
    );
};

/**
 * Overlay button — same pattern as `Link`, but for cards that trigger an
 * action instead of navigation.
 */
export const Button = (props: ComponentProps<typeof ButtonAtom>) => {
    const { className, ...otherProps } = props;
    return (
        <ButtonAtom
            data-card-overlay
            noStyle
            noOutline
            {...otherProps}
            className={cn("static after:absolute after:inset-0", className)}
        />
    );
};

/**
 * Higher link — sits above the overlay via `relative z-10`. Use for
 * secondary links inside a clickable card (e.g. category, tag).
 */
export const HigherLink = (props: ComponentProps<typeof LinkAtom>) => {
    const { className, ...otherProps } = props;
    return <LinkAtom {...otherProps} className={cn("relative z-10", className)} />;
};

/**
 * Higher button — sits above the overlay via `relative z-10`. Use for
 * secondary actions inside a clickable card (e.g. favorite, menu).
 */
export const HigherButton = (props: ComponentProps<typeof ButtonAtom>) => {
    const { className, ...otherProps } = props;
    return <ButtonAtom {...otherProps} className={cn("relative z-10", className)} />;
};
