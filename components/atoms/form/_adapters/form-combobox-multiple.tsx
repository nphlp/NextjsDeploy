"use client";

import ComboboxMultiple from "@atoms/combobox/combobox-multiple";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormComboboxMultipleProps = FieldProps & {
    name: string;
    items: string[];
    children: ReactNode;
};

export function FormComboboxMultiple(props: FormComboboxMultipleProps) {
    const { name, label, description, disabled, required, items, children } = props;

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
            <ComboboxMultiple items={items} value={field.value} onValueChange={(value) => field.onChange(value)}>
                {children}
            </ComboboxMultiple>
        </FieldWrapper>
    );
}
