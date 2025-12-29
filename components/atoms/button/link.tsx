import cn from "@lib/cn";
import { Loader } from "lucide-react";
import { Route } from "next";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { LinkHTMLAttributes, ReactNode, RefObject } from "react";
import buttonVariants from "./button-variants";

export type LinkProps = {
    href: Route;
    label: string;
    children?: ReactNode;

    // Styles
    colors?: "primary" | "foreground" | "outline" | "ghost" | "destructive" | false;
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
    isLoading?: boolean;
    isDisabled?: boolean;

    // Legacy Props
    legacyProps?: Omit<LinkHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

    // Others
    ref?: RefObject<HTMLAnchorElement>;
    onClick?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
} & NextLinkProps<Route>;

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
        isLoading,
        isDisabled,
        // Others
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

    return (
        <NextLink
            href={href}
            aria-label={label}
            className={cn(buttonVariants(noStyle ? noStyleMode : styledMode), "relative", className)}
            data-disabled={isDisabled || isLoading}
            {...legacyProps}
            {...othersProps}
        >
            {isLoading && (
                <div className="absolute">
                    <Loader className="size-5 animate-spin" />
                </div>
            )}
            <div className={cn(isLoading && "invisible")}>{label ?? children}</div>
        </NextLink>
    );
}
