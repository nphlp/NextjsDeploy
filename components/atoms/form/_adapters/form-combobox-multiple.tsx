"use client";

import ComboboxMultiple from "@atoms/combobox/combobox-multiple";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";

type FormComboboxMultipleProps = {
    name: string;
    items: string[];
    children: ReactNode;
};

export function FormComboboxMultiple(props: FormComboboxMultipleProps) {
    const { name, items, children } = props;

    const register = useFormContext();
    const field = register(name);

    return (
        <ComboboxMultiple items={items} value={field.value} onValueChange={(value) => field.onChange(value)}>
            {children}
        </ComboboxMultiple>
    );
}
