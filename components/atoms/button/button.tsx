"use client";

import { Button as ButtonBaseUi } from "@base-ui/react/button";
import cn from "@lib/cn";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, FocusEvent, MouseEvent, ReactNode, RefObject } from "react";
import { ButtonColorsType, ButtonPaddingType, ButtonRoundedType, buttonStyle } from "../_core/button-variants";

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    label: string;
    children?: ReactNode;

    // Styles
    colors?: ButtonColorsType;
    rounded?: ButtonRoundedType;
    padding?: ButtonPaddingType;
    /** Disable flex styles */
    noFlex?: boolean;
    /** Disable outline styles */
    noOutline?: boolean;
    /** Disable all styles (except outline) */
    noStyle?: boolean;
    className?: string;
    loaderColorClass?: string;

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
        colors = "outline",
        rounded = "md",
        padding = "md",
        noFlex = false,
        noOutline = false,
        noStyle = false,
        className,
        loaderColorClass,
        // States
        loading,
        disabled,
        // Others
        legacyProps,
        ...othersProps
    } = props;

    // Loader color default
    const loaderDefaultColor = cn(
        colors === "solid" && "text-gray-300",
        colors === "outline" && "text-gray-700",
        colors === "ghost" && "text-gray-700",
        colors === "primary" && "text-gray-200",
        colors === "destructive" && "text-gray-200",
        colors === "link" && "text-gray-500",
        noStyle && "text-foreground",
        noStyle && loaderColorClass,
    );

    return (
        <ButtonBaseUi
            type={type}
            aria-label={label}
            title={label}
            className={cn(
                buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }),
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
                <div data-loader className={cn("absolute", loaderDefaultColor)}>
                    <Loader className="size-5 animate-spin" />
                </div>
            )}
            {children ?? label}
        </ButtonBaseUi>
    );
}
