"use client";

import Combobox from "@atoms/combobox";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormComboboxProps = FieldProps & {
    name: string;
    items: string[];
    children: ReactNode;
};

export function FormCombobox(props: FormComboboxProps) {
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
            <Combobox items={items} value={field.value} onValueChange={(value) => field.onChange(value)}>
                {children}
            </Combobox>
        </FieldWrapper>
    );
}
