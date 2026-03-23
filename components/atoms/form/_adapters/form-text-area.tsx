"use client";

import TextArea from "@atoms/input/text-area";
import { ChangeEvent } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormTextAreaProps = FieldProps & {
    name: string;
    placeholder?: string;
    className?: string;
};

export function FormTextArea(props: FormTextAreaProps) {
    const { name, label, description, disabled, required, className, ...otherProps } = props;

    const register = useFormContext();
    const field = register(name);

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
            <TextArea
                name={name}
                value={field.value}
                disabled={disabled}
                onFocus={() => field.onFocus()}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                onBlur={() => field.onBlur()}
                className={className}
                {...otherProps}
            />
        </FieldWrapper>
    );
}
