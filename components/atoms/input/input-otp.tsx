"use client";

import { useFormContext } from "@atoms/form/_context/use-form-context";
import cn from "@lib/cn";
import { ClipboardEvent, FocusEvent, KeyboardEvent, useRef } from "react";
import { Root } from "./atoms";

type InputOtpProps = {
    length?: number;
    onComplete: (code: string) => void;
    disabled?: boolean;
    className?: string;

    // Form context integration
    name?: string;
    useForm?: boolean;

    // Controlled mode (when not using form context)
    value?: string;
    onChange?: (value: string) => void;
};

export default function InputOtp(props: InputOtpProps) {
    const {
        length = 6,
        onComplete,
        disabled = false,
        className,
        name,
        useForm: useFormProp = false,
        value,
        onChange,
    } = props;

    // Form context
    const register = useFormContext();
    const field = useFormProp && name ? register(name) : null;

    const resolvedValue: string = field ? field.value : (value ?? "");
    const digits = resolvedValue
        .padEnd(length, " ")
        .slice(0, length)
        .split("")
        .map((c) => (c === " " ? "" : c));

    const containerRef = useRef<HTMLDivElement>(null);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const focusInput = (index: number) => {
        if (index >= 0 && index < length) {
            inputsRef.current[index]?.focus();
        }
    };

    const updateDigits = (newDigits: string[]) => {
        const newValue = newDigits.join("");
        field?.onChange(newValue);
        onChange?.(newValue);
        if (newDigits.every((d) => d !== "")) {
            onComplete(newValue);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newDigits = [...digits];
            if (newDigits[index]) {
                newDigits[index] = "";
                updateDigits(newDigits);
            } else if (index > 0) {
                newDigits[index - 1] = "";
                updateDigits(newDigits);
                focusInput(index - 1);
            }
            return;
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusInput(index - 1);
            return;
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            focusInput(index + 1);
            return;
        }

        // Only allow digits
        if (/^\d$/.test(e.key)) {
            e.preventDefault();
            const newDigits = [...digits];
            newDigits[index] = e.key;
            updateDigits(newDigits);
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (pasted.length === 0) return;

        const newDigits = [...digits];
        for (let i = 0; i < pasted.length; i++) {
            newDigits[i] = pasted[i];
        }
        updateDigits(newDigits);
        focusInput(Math.min(pasted.length, length - 1));
    };

    // Container-level focus/blur for form context (avoids flicker between digits)
    const handleContainerFocus = () => {
        field?.onFocus();
    };

    const handleContainerBlur = (e: FocusEvent<HTMLDivElement>) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            field?.onBlur();
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn("flex gap-2", className)}
            onFocus={handleContainerFocus}
            onBlur={handleContainerBlur}
        >
            {digits.map((digit, index) => (
                <Root
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}
                    type="text"
                    value={digit}
                    disabled={disabled}
                    autoComplete="one-time-code"
                    autoFocus={index === 0}
                    onFocus={(e) => e.target.select()}
                    onChange={() => {}}
                    className="size-12 p-0 text-center text-lg font-semibold disabled:bg-gray-50"
                    legacyProps={{
                        inputMode: "numeric",
                        maxLength: 1,
                        onKeyDown: (e) => handleKeyDown(index, e),
                        onPaste: handlePaste,
                    }}
                />
            ))}
        </div>
    );
}
