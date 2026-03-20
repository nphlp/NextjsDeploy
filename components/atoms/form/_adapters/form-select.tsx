"use client";

import Select from "@atoms/select";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";

type FormSelectProps = {
    name: string;
    children: ReactNode;
};

export function FormSelect(props: FormSelectProps) {
    const { name, children } = props;

    const register = useFormContext();
    const field = register(name);

    return (
        <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
            {children}
        </Select>
    );
}
