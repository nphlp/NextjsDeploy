import { ButtonColorsType, ButtonPaddingType, ButtonRoundedType } from "@atoms/button/button-variants";
import { ButtonHTMLAttributes, ComponentProps, HTMLAttributes } from "react";

// ----- Standard React Types ----- //
export type StandardAttributes = HTMLAttributes<HTMLElement>;
export type ButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement>;

// ----- Utility Types ----- //

/**
 * All native props except className, children, and explicitly declared keys.
 * K = keys to exclude (already declared as explicit props).
 */
export type LegacyProps<T extends HTMLAttributes<HTMLElement>, K extends string = never> = Omit<
    T,
    "className" | "children" | K
>;

/**
 * BaseUI-specific props (ComponentProps minus native HTML attributes).
 * C = BaseUI component, T = native element attribute type.
 * K = keys to keep from T (when BaseUI re-declares a native HTML prop like `value`).
 */
export type BaseUiProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    C extends (...args: any) => any,
    T extends HTMLAttributes<HTMLElement>,
    K extends string = never,
> = Omit<ComponentProps<C>, Exclude<keyof T, K>>;

// ----- Button Style Props ----- //

/**
 * Shared styling props for button-like atoms (Trigger, Close, etc.).
 * Uses `buttonVariants` from `@atoms/button/button-variants`.
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
