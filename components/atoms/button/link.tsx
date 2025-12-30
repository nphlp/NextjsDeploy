"use client";

import cn from "@lib/cn";
import { Loader } from "lucide-react";
import { Route } from "next";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { LinkHTMLAttributes, ReactNode, RefObject } from "react";
import buttonVariants from "./button-variants";

type OnNavigateEvent = { preventDefault: () => void };

export type LinkProps = {
    href: Route;
    label: string;
    children?: ReactNode;

    // Styles
    colors?: "primary" | "foreground" | "outline" | "ghost" | "destructive" | "link" | false;
    rounded?: "md" | "full" | false;
    padding?: "text" | "icon" | false;
    /** Disable flex styles */
    noFlex?: boolean;
    /** Disable outline styles */
    noOutline?: boolean;
    /** Disable all styles (except outline) */
    noStyle?: boolean;
    className?: string;

    // States
    loading?: boolean;
    disabled?: boolean;

    // Nextjs Link Props
    onNavigate?: (e: OnNavigateEvent) => void;

    // Legacy Props
    legacyProps?: Omit<LinkHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

    // Others
    ref?: RefObject<HTMLAnchorElement>;
} & Pick<NextLinkProps<Route>, "replace" | "scroll" | "prefetch">;

export default function Link(props: LinkProps) {
    const {
        href,
        label,
        children,
        // Styles
        colors = "foreground",
        rounded = "md",
        padding = "text",
        noFlex = false,
        noOutline = false,
        noStyle = false,
        className,
        // States
        loading,
        disabled,
        // Others
        onNavigate,
        legacyProps,
        ...othersProps
    } = props;

    // No style mode (outline still appliable)
    const noStyleMode = {
        colors: false,
        rounded: false,
        padding: false,
        flex: false,
        outline: !noOutline,
    };

    // With style mode
    const styledMode = {
        colors,
        rounded,
        padding,
        flex: !noFlex,
        outline: !noOutline,
    };

    const handleNavigate = (e: OnNavigateEvent) => {
        if (disabled || loading) {
            e.preventDefault();
        }
        onNavigate?.(e);
    };

    return (
        <NextLink
            href={href}
            aria-label={label}
            className={cn(
                buttonVariants(noStyle ? noStyleMode : styledMode),
                "relative",
                // Not first child invisible when loading
                loading && "text-transparent! [&>*:not([data-loader])]:invisible",
                className,
            )}
            data-disabled={disabled || loading}
            onNavigate={handleNavigate}
            {...legacyProps}
            {...othersProps}
        >
            {loading && (
                <div data-loader className="absolute text-gray-500">
                    <Loader className="size-5 animate-spin" />
                </div>
            )}
            {children ?? label}
        </NextLink>
    );
}
