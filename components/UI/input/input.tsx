"use client";

import { combo } from "@lib/combo";
import { ChangeEvent, InputHTMLAttributes, MouseEvent, RefObject } from "react";
import { InputVariant, theme } from "./theme";

export type InputClassName = {
    component?: string;
    label?: string;
    input?: string;
};

/** Input props */
export type InputProps = {
    label: string;
    autoComplete: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
    setValue: (value: string) => void;
    value: string;

    // Styles
    variant?: InputVariant;
    className?: InputClassName;
    noLabel?: boolean;

    // Optional
    placeholder?: string;
    autoFocus?: boolean;
    type?: InputHTMLAttributes<HTMLInputElement>["type"];
    ref?: RefObject<HTMLInputElement | null>;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    legacyProps?: InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Input component
 * @example
 * ```tsx
 * // Define the state
 * const [name, setName] = useInputState();
 *
 * // Use the component
 * <Input
 *     label="Name"
 *     type="text"
 *     onChange={setName}
 *     value={name}
 * />
 * ```
 */
export default function Input(props: InputProps) {
    const {
        label,
        autoComplete,
        setValue,
        value,
        variant = "default",
        noLabel = false,
        required = true,
        className,
        placeholder,
        onChange,
        ...others
    } = props;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange?.(e);
    };

    /** Prevent a clic on the label to focus the input */
    const preventDefault = (e: MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <label onClick={preventDefault} className={combo(theme[variant].component, className?.component)}>
            {/* Label */}
            <div className={combo(theme[variant].label, className?.label, noLabel && "sr-only")}>{label}</div>

            {/* Input */}
            <input
                name={label}
                autoComplete={autoComplete}
                placeholder={placeholder ?? label}
                onChange={handleChange}
                className={combo(theme[variant].input, className?.input)}
                required={required}
                value={value}
                {...others}
                {...(autoComplete === "off" && {
                    // 1Password
                    "data-1p-ignore": "true",
                    // LastPass
                    "data-lpignore": "true",
                    // ProtonPass
                    "data-protonpass-ignore": "true",
                })}
            />
        </label>
    );
}
