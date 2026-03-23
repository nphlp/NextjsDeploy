"use client";

import InputPassword from "@atoms/input/input-password";
import { ChangeEvent, FocusEvent, HTMLInputAutoCompleteAttribute, Ref } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormInputPasswordProps = FieldProps & {
    name: string;
    placeholder?: string;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    autoFocus?: boolean;
    className?: string;
    ref?: Ref<HTMLInputElement>;

    // Event
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
};

export function FormInputPassword(props: FormInputPasswordProps) {
    const { name, label, description, disabled, required, className, onFocus, onChange, onBlur, ...otherProps } = props;

    const register = useFormContext();
    const field = register(name);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        field.onFocus();
        onFocus?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        field.onChange(e.target.value);
        onChange?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        field.onBlur();
        onBlur?.(e);
    };

    return (
        <FieldWrapper
            name={name}
            label={label}
            description={description}
            disabled={disabled}
            required={required}
            status={field.status}
            errors={field.errors}
        >
            <InputPassword
                name={name}
                value={field.value}
                disabled={disabled}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                className={className}
                {...otherProps}
            />
        </FieldWrapper>
    );
}
