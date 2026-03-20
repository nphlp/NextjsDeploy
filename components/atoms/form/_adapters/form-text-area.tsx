"use client";

import TextArea from "@atoms/input/text-area";
import { ChangeEvent } from "react";
import { useFormContext } from "../_context/use-form-context";

type FormTextAreaProps = {
    name: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export function FormTextArea(props: FormTextAreaProps) {
    const { name, className, ...otherProps } = props;

    const register = useFormContext();
    const field = register(name);

    return (
        <TextArea
            name={name}
            value={field.value}
            onFocus={() => field.onFocus()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
            onBlur={() => field.onBlur()}
            className={className}
            {...otherProps}
        />
    );
}
