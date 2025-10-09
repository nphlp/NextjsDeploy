"use client";

import Loader from "@comps/UI/loader";
import { combo } from "@lib/combo";
import { ButtonHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref } from "react";
import { ButtonVariant, theme } from "./theme";

export type ButtonClassName = {
    button?: string;
    isLoading?: string;
    isDisabled?: string;
    text?: string;
    loader?: string;
};

export type ButtonProps = {
    label: string;
    loadingLabel?: string;
    isLoading?: boolean;
    isDisabled?: boolean;

    // Styles
    variant?: ButtonVariant;
    className?: ButtonClassName;
    noPointer?: boolean;
    noRing?: boolean;
    focusVisible?: boolean;

    // Events
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;

    // Optional
    type?: "button" | "submit" | "reset";
    children?: ReactNode;
    ref?: Ref<HTMLButtonElement | null>;
    legacyProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

/**
 * Button component
 * @example
 * ```tsx
 * // Import Route type
 * import { Route } from "next";
 *
 * // Define the state
 * const [isLoading, setIsLoading] = useState(false);
 *
 * // Use the component
 * <Link
 *     label="Send the form"
 *     href={`/task/${slug}` as Route}
 * >
 *     Send
 * </Link>
 * ```
 */
export default function Button(props: ButtonProps) {
    const {
        type = "button",
        label,
        loadingLabel,
        variant = "default",
        noPointer = false,
        noRing = false,
        focusVisible = false,
        isLoading,
        isDisabled,
        className,
        children,
        ...others
    } = props;

    return (
        <button
            type={type}
            aria-label={label}
            className={combo(
                // Pointer events, ring, padding
                !noPointer && "cursor-pointer disabled:cursor-not-allowed",
                !noRing && "ring-teal-300 transition-all duration-150 outline-none",
                !focusVisible ? "focus:ring-2" : "focus-visible:ring-2",
                // Variant styles
                theme[variant].button,
                // Is loading or disabled styles
                isLoading && theme[variant].isLoading,
                isDisabled && theme[variant].isDisabled,
                className?.button,
            )}
            disabled={isLoading || isDisabled}
            {...others}
        >
            {isLoading && <Loader className={combo(theme[variant].loader, className?.loader)} />}
            <div className={combo(theme[variant].text, className?.text)}>{loadingLabel ?? children ?? label}</div>
        </button>
    );
}
