"use client";

import InputOtp from "@atoms/input/input-otp";
import { useFormContext } from "../_context/use-form-context";

type FormInputOtpProps = {
    name: string;
    length?: number;
    onComplete: (code: string) => void;
    disabled?: boolean;
    className?: string;
};

export function FormInputOtp(props: FormInputOtpProps) {
    const { name, ...otherProps } = props;

    const register = useFormContext();
    const field = register(name);

    return <InputOtp value={field.value} onChange={field.onChange} {...otherProps} />;
}
