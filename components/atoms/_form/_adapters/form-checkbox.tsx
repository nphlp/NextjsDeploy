"use client";

import Checkbox, { Indicator } from "@atoms/checkbox";
import cn from "@lib/cn";
import { ReactNode } from "react";
import { useFormContext } from "../_context/use-form-context";
import { FieldWrapper } from "../atom";

type FormCheckboxProps = {
    name: string;
    text?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    children?: ReactNode;
    className?: string;
};

export function FormCheckbox(props: FormCheckboxProps) {
    const { name, text, description, disabled = false, required, children, className } = props;

    const register = useFormContext();
    const field = register(name);

    return (
        <FieldWrapper
            name={name}
            description={description}
            disabled={disabled}
            required={required}
            status={field.status}
            errors={field.errors}
        >
            <label
                className={cn(
                    // Layout
                    "text-foreground flex items-center gap-2 text-base",
                    // Cursor
                    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                    // Form Field state
                    "group-data-disabled/field:cursor-not-allowed group-data-disabled/field:opacity-50",
                    // Overrides
                    className,
                )}
            >
                <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    disabled={disabled}
                >
                    {children ?? <Indicator />}
                </Checkbox>
                {text && (
                    <span
                        className={cn(
                            // Text
                            "text-sm font-medium select-none",
                            // Form Field state
                            "group-data-invalid/field:text-red-800",
                        )}
                    >
                        {text}
                    </span>
                )}
            </label>
        </FieldWrapper>
    );
}
