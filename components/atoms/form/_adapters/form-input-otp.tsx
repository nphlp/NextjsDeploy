"use client";

import InputOtp from "@atoms/input/input-otp";
import { useFormContext } from "../_context/use-form-context";
import { FieldProps, FieldWrapper } from "../atom";

type FormInputOtpProps = FieldProps & {
    name: string;
    length?: number;
    onComplete: (code: string) => void;
    className?: string;
};

export function FormInputOtp(props: FormInputOtpProps) {
    const { name, label, description, disabled, required, ...otherProps } = props;

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
            <InputOtp value={field.value} onChange={field.onChange} disabled={disabled} {...otherProps} />
        </FieldWrapper>
    );
}
