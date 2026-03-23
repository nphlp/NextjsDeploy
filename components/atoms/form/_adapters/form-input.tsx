"use client";

import Input from "@atoms/input";
import { RootProps } from "@atoms/input/atoms";
import { ChangeEvent, FocusEvent } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormInputProps = FieldProps & {
    name: string;
} & Omit<RootProps, "value">;

export function FormInput(props: FormInputProps) {
    const {
        name,
        label,
        description,
        disabled,
        required,
        className,
        setValue,
        onFocus,
        onChange,
        onBlur,
        ...otherProps
    } = props;

    const register = useFormContext();
    const field = register(name);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        field.onFocus();
        onFocus?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        field.onChange(e.target.value);
        setValue?.(e.target.value);
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
            <Input
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
