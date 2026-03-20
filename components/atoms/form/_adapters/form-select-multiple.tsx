"use client";

import SelectMultiple from "@atoms/select/select-multiple";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";

type FormSelectMultipleProps = {
    name: string;
    children: ReactNode;
};

export function FormSelectMultiple(props: FormSelectMultipleProps) {
    const { name, children } = props;

    const register = useFormContext();
    const field = register(name);

    return (
        <SelectMultiple selected={field.value} setSelected={(value) => field.onChange(value)}>
            {children}
        </SelectMultiple>
    );
}
