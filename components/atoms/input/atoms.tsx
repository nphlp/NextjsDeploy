"use client";

import { useFormContext } from "@atoms/form/_context/use-form-context";
import { Input as InputBaseUi } from "@base-ui/react";
import cn from "@lib/cn";
import { ChangeEvent, FocusEvent, HTMLInputAutoCompleteAttribute, InputHTMLAttributes, ReactElement, Ref } from "react";

export type RootProps = {
    // Styles
    className?: string;

    // Form integration
    type?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;

    // Accessibility
    required?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    autoFocus?: boolean;

    // useRef compatibility
    ref?: Ref<HTMLInputElement>;

    // useState compatibility
    setValue?: (value: string) => void;
    value?: string;

    // Event
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;

    // Form context integration
    useForm?: boolean;

    // Custom render (for textarea, etc.)
    render?: ReactElement;

    // Legacy props
    legacyProps?: InputHTMLAttributes<HTMLInputElement>;
};

export const Root = (props: RootProps) => {
    const {
        className,
        name,
        value,
        setValue,
        useForm = false,
        onFocus,
        onChange,
        onBlur,
        render,
        legacyProps,
        ...othersProps
    } = props;

    // Form and Field context
    const register = useFormContext();
    const field = useForm && name ? register(name) : null;

    const resolvedValue = field ? field.value : value;

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        onFocus?.(e);
        field?.onFocus();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        field?.onChange(e.target.value);
        setValue?.(e.target.value);
        onChange?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        field?.onBlur();
        onBlur?.(e);
    };

    return (
        <InputBaseUi
            name={name}
            value={resolvedValue}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            render={render}
            className={cn(
                // Layout
                "w-full",
                // Border
                "rounded-md border border-gray-200",
                // Padding
                "px-3.5 py-2",
                // Text
                "text-base text-gray-900",
                // Outline
                "focus:outline-outline focus:outline-2 focus:outline-offset-0",
                // Form Field state
                "group-data-disabled/field:bg-gray-50",
                "group-data-invalid/field:border-red-800",
                className,
            )}
            {...othersProps}
            {...legacyProps}
        />
    );
};
