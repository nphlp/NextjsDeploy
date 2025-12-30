"use client";

import { Button as ButtonBaseUi } from "@base-ui/react/button";
import cn from "@lib/cn";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, FocusEvent, MouseEvent, ReactNode, RefObject } from "react";
import buttonVariants from "./button-variants";

type ButtonProps = {
    type?: "button" | "submit" | "reset";
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

    // Legacy Props
    legacyProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>;

    // Others
    ref?: RefObject<HTMLButtonElement>;
    onClick?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
};

export default function Button(props: ButtonProps) {
    const {
        type = "button",
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
        <ButtonBaseUi
            type={type}
            aria-label={label}
            className={cn(
                buttonVariants(noStyle ? noStyleMode : styledMode),
                "relative",
                // Not first child invisible when loading
                loading && "text-transparent! [&>*:not([data-loader])]:invisible",
                className,
            )}
            disabled={disabled || loading}
            focusableWhenDisabled
            {...legacyProps}
            {...othersProps}
        >
            {loading && (
                <div data-loader className="absolute text-gray-500">
                    <Loader className="size-5 animate-spin" />
                </div>
            )}
            {children ?? label}
        </ButtonBaseUi>
    );
}
