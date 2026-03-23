"use client";

import Select from "@atoms/select";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormSelectProps = FieldProps & {
    name: string;
    children: ReactNode;
};

export function FormSelect(props: FormSelectProps) {
    const { name, label, description, disabled, required, children } = props;

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
            <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                {children}
            </Select>
        </FieldWrapper>
    );
}
