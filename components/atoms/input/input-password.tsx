"use client";

import Button from "@atoms/button";
import { Input as InputBaseUi } from "@base-ui/react/input";
import cn from "@lib/cn";
import { Eye, EyeClosed } from "lucide-react";
import { ChangeEvent, FocusEvent, HTMLInputAutoCompleteAttribute, InputHTMLAttributes, Ref, useState } from "react";

type InputProps = {
    name?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;

    // Form integration
    required?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    autoFocus?: boolean;

    // For react-hook-form compatibility
    ref?: Ref<HTMLInputElement>;

    // Event
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;

    // Legacy props
    legacyProps?: Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputProps>;
};

export default function InputPassword(props: InputProps) {
    const { legacyProps, ...othersProps } = props;

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <InputBaseUi
                type={showPassword ? "text" : "password"}
                className={cn(
                    // Layout
                    "h-10 w-full",
                    // Border
                    "rounded-md border border-gray-200",
                    // Padding
                    "px-3.5 py-2",
                    // Text
                    "text-base text-gray-900",
                    // Outline
                    "focus:outline-outline focus:outline-2 focus:-outline-offset-1",
                    // Base UI state
                    "data-disabled:bg-gray-50",
                    "data-invalid:border-red-800",
                )}
                {...legacyProps}
                {...othersProps}
            />
            <Button
                label="Toggle password visiblity"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 px-3 py-3 text-gray-600"
                noStyle
            >
                {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
            </Button>
        </div>
    );
}

export const InputPasswordSkeleton = () => {
    return (
        <div className="relative w-full">
            <div
                className={cn(
                    "animate-pulse",
                    // Layout
                    "h-10 w-full",
                    // Border
                    "rounded-md border border-gray-200",
                    // Padding
                    "px-3.5 py-2.25",
                )}
            >
                <div className="h-5 w-34 flex-none rounded bg-gray-100"></div>
                <div className="absolute top-1/2 right-3 size-5 flex-none -translate-y-1/2 rounded bg-gray-100"></div>
            </div>
        </div>
    );
};
