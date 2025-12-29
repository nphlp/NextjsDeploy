"use client";

import { Button as ButtonBaseUi } from "@base-ui/react/button";
import { cn } from "@comps/SHADCN/lib/utils";
import { cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, FocusEvent, MouseEvent, ReactNode, RefObject } from "react";

const structure = cn(
    // Useless
    "m-0 outline-0",
    // Cursor
    "cursor-pointer data-disabled:cursor-default",
    // Border
    "border border-transparent",
    // Text
    "font-inherit text-base leading-6 font-medium select-none",
    // Transition
    "transition-all duration-100 ease-in-out",
);

const classVariants = cva(structure, {
    variants: {
        colors: {
            primary: cn(
                // Border
                "border-primary",
                // Border (hover)
                "hover:border-primary-100",
                // Border (active)
                "active:border-t-primary-300",
                "active:border-x-primary-200",
                "active:border-b-primary-200",
                // Border (disabled)
                "data-disabled:border-primary-200",
                "data-disabled:hover:border-primary-200",
                "data-disabled:active:border-primary-200",

                // Background
                "bg-primary",
                // Background (hover)
                "hover:bg-primary-100",
                // Background (active)
                "active:bg-primary-200",
                // Background (disabled)
                "data-disabled:bg-primary-200",
                "data-disabled:hover:bg-primary-200",
                "data-disabled:active:bg-primary-200",

                // Text
                "text-background",
                // Text (disabled)
                "data-disabled:text-primary-300",

                // Shadow
                "active:inset-shadow-sm active:inset-shadow-primary-300",
                // Shadow (disabled)
                "active:data-disabled:inset-shadow-none",
            ),
            foreground: cn(
                // Border
                "border-gray-950",
                // Border (hover)
                "hover:border-gray-900",
                // Border (active)
                "active:border-t-gray-950",
                "active:border-x-gray-900",
                "active:border-b-gray-800",
                // Border (disabled)
                "data-disabled:border-gray-800",
                "data-disabled:hover:border-gray-800",
                "data-disabled:active:border-gray-800",

                // Background
                "bg-gray-950",
                // Background (hover)
                "hover:bg-gray-900",
                // Background (active)
                "active:bg-gray-800",
                // Background (disabled)
                "data-disabled:bg-gray-800",
                "data-disabled:hover:bg-gray-800",
                "data-disabled:active:bg-gray-800",

                // Text
                "text-gray-100",
                // Text (disabled)
                "data-disabled:text-gray-400",

                // Shadow
                "active:inset-shadow-sm active:inset-shadow-gray-950",
                // Shadow (disabled)
                "active:data-disabled:inset-shadow-none",
            ),
            outline: cn(
                // Border
                "border-gray-200",
                // Border (hover)
                "hover:border-gray-300",
                // Border (active)
                "active:border-gray-400",
                // Border (disabled)
                "data-disabled:border-gray-200",
                "data-disabled:hover:border-gray-200",
                "data-disabled:active:border-gray-200",

                // Background
                "bg-gray-50",
                // Background (hover)
                "hover:bg-gray-100",
                // Background (active)
                "active:bg-gray-200",
                // Background (disabled)
                "data-disabled:bg-gray-100",
                "data-disabled:hover:bg-gray-100",
                "data-disabled:active:bg-gray-100",

                // Text
                "text-gray-800",
                // Text (disabled)
                "data-disabled:text-gray-400",

                // Shadow
                "active:inset-shadow-sm active:inset-shadow-gray-400",
                // Shadow (disabled)
                "active:data-disabled:inset-shadow-none",
            ),
            ghost: "",
            destructive: "",
            false: "",
        },
        rounded: {
            md: "rounded-md",
            full: "rounded-full",
            false: "rounded-none",
        },
        padding: {
            text: "h-10 px-3.5",
            icon: "size-10",
            false: "p-0",
        },
        flex: {
            true: "flex items-center justify-center",
            false: "",
        },
        outline: {
            true: "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-outline",
            false: "",
        },
    },
});

type ButtonProps = {
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
    legacyProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>;

    // Others
    ref?: RefObject<HTMLButtonElement>;
    onClick?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
};

export default function Button(props: ButtonProps) {
    const {
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
        <ButtonBaseUi
            aria-label={label}
            className={cn(classVariants(noStyle ? noStyleMode : styledMode), "relative", className)}
            disabled={isDisabled || isLoading}
            focusableWhenDisabled
            {...legacyProps}
            {...othersProps}
        >
            {isLoading && (
                <div className="absolute">
                    <Loader className="size-5 animate-spin" />
                </div>
            )}
            <div className={cn(isLoading && "invisible")}>{label ?? children}</div>
        </ButtonBaseUi>
    );
}
