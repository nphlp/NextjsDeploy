"use client";

import Combobox from "@atoms/combobox";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";

type FormComboboxProps = {
    name: string;
    items: string[];
    children: ReactNode;
};

export function FormCombobox(props: FormComboboxProps) {
    const { name, items, children } = props;

    const register = useFormContext();
    const field = register(name);

    return (
        <Combobox items={items} value={field.value} onValueChange={(value) => field.onChange(value)}>
            {children}
        </Combobox>
    );
}
