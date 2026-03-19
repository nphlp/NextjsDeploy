import cn from "@lib/cn";
import { VariantProps, cva } from "class-variance-authority";

const structure = cn(
    // Useless
    "m-0 block w-fit",
    // Cursor
    "cursor-pointer data-disabled:cursor-default",
    // Text
    "font-inherit text-base font-medium select-none",
    // Outline
    "outline-2 outline-transparent",
    // Transition
    "transition-all duration-100 ease-in-out",
);

const buttonVariants = cva(structure, {
    variants: {
        colors: {
            solid: cn(
                // Border
                "border border-gray-950",
                // Border (hover)
                "hover:border-gray-900",
                // Border (active)
                "active:border-gray-800",
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
            ),
            outline: cn(
                // Border
                "border border-gray-200",
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
                "text-gray-900",
                // Text (disabled)
                "data-disabled:text-gray-400",
            ),
            ghost: cn(
                // Border
                "border border-transparent",
                // Border (hover)
                "hover:border-gray-50",
                // Border (active)
                "active:border-gray-100",
                // Border (disabled)
                "data-disabled:border-gray-100",
                "data-disabled:hover:border-gray-100",
                "data-disabled:active:border-gray-100",

                // Background
                "bg-gray-transparent",
                // Background (hover)
                "hover:bg-gray-50",
                // Background (active)
                "active:bg-gray-100",
                // Background (disabled)
                "data-disabled:bg-gray-100",
                "data-disabled:hover:bg-gray-100",
                "data-disabled:active:bg-gray-100",

                // Text
                "text-gray-800",
                // Text (disabled)
                "data-disabled:text-gray-400",
            ),
            primary: cn(
                // Border
                "border border-primary",
                // Border (hover)
                "hover:border-primary-hover",
                // Border (active)
                "active:border-primary-active",
                // Border (disabled)
                "data-disabled:border-primary-active",
                "data-disabled:hover:border-primary-active",
                "data-disabled:active:border-primary-active",

                // Background
                "bg-primary",
                // Background (hover)
                "hover:bg-primary-hover",
                // Background (active)
                "active:bg-primary-active",
                // Background (disabled)
                "data-disabled:bg-primary-active",
                "data-disabled:hover:bg-primary-active",
                "data-disabled:active:bg-primary-active",

                // Text
                "text-background",
                // Text (disabled)
                "data-disabled:text-gray-300",
            ),
            destructive: cn(
                // Border
                "border border-destructive",
                // Border (hover)
                "hover:border-destructive-hover",
                // Border (active)
                "active:border-destructive-active",
                // Border (disabled)
                "data-disabled:border-destructive-active",
                "data-disabled:hover:border-destructive-active",
                "data-disabled:active:border-destructive-active",

                // Background
                "bg-destructive",
                // Background (hover)
                "hover:bg-destructive-hover",
                // Background (active)
                "active:bg-destructive-active",
                // Background (disabled)
                "data-disabled:bg-destructive-active",
                "data-disabled:hover:bg-destructive-active",
                "data-disabled:active:bg-destructive-active",

                // Text
                "text-background",
                // Text (disabled)
                "data-disabled:text-gray-300",
            ),
            link: cn(
                // Decoration
                "underline-offset-2",
                // Decoration (hover)
                "hover:underline",
                // Decoration (active)
                "active:underline-offset-3",
                // Decoration (disabled)
                "data-disabled:no-underline",
                "data-disabled:hover:no-underline",
                "data-disabled:active:no-underline",

                // Text
                "text-foreground",
                // Text (disabled)
                "data-disabled:text-gray-300",
            ),
            false: "",
        },
        rounded: {
            md: "rounded-md",
            full: "rounded-full",
            false: "rounded-none",
        },
        padding: {
            md: "min-h-10 px-3.5 py-0.5",
            sm: "min-h-8 px-2 py-0.5",
            xs: "min-h-6 px-1",
            icon: "size-10",
            false: "p-0",
        },
        flex: {
            true: "flex items-center justify-center gap-2",
            false: "",
        },
        outline: {
            true: "focus-visible:outline-outline",
            false: "",
        },
    },
});

type ButtonVariantsType = VariantProps<typeof buttonVariants>;

type ButtonColorsType = ButtonVariantsType["colors"];
type ButtonRoundedType = ButtonVariantsType["rounded"];
type ButtonPaddingType = ButtonVariantsType["padding"];

export type { ButtonVariantsType, ButtonColorsType, ButtonRoundedType, ButtonPaddingType };

/**
 * Shared styling props for button-like atoms (Trigger, Close, etc.).
 */
export type ButtonStyleProps = {
    colors?: ButtonColorsType;
    rounded?: ButtonRoundedType;
    padding?: ButtonPaddingType;
    /** Disable flex styles */
    noFlex?: boolean;
    /** Disable outline styles */
    noOutline?: boolean;
    /** Disable all styles (except outline) */
    noStyle?: boolean;
};

/**
 * Resolves `ButtonStyleProps` into a `buttonVariants()` className string.
 * Each component sets its own defaults before calling this.
 */
export function buttonStyle(props: {
    colors: ButtonColorsType;
    rounded: ButtonRoundedType;
    padding: ButtonPaddingType;
    noFlex: boolean;
    noOutline: boolean;
    noStyle: boolean;
}) {
    return buttonVariants({
        colors: props.noStyle ? false : props.colors,
        rounded: props.noStyle ? false : props.rounded,
        padding: props.noStyle ? false : props.padding,
        flex: props.noStyle ? false : !props.noFlex,
        outline: !props.noOutline,
    });
}

/**
 * Resolves the default loader color based on the current `colors` variant.
 */
export function loaderColor(colors: ButtonColorsType, noStyle: boolean, loaderColorClass?: string) {
    return cn(
        colors === "solid" && "text-gray-300",
        colors === "outline" && "text-gray-700",
        colors === "ghost" && "text-gray-700",
        colors === "primary" && "text-gray-200",
        colors === "destructive" && "text-gray-200",
        colors === "link" && "text-gray-500",
        noStyle && "text-foreground",
        noStyle && loaderColorClass,
    );
}

export default buttonVariants;
