"use client";

import Button from "@atoms/button";
import { useToast } from "@atoms/toast";
import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import cn from "@lib/cn";
import { ClipboardPaste } from "lucide-react";

type InputOtpProps = {
    length?: number;
    onComplete: (code: string) => void;
    disabled?: boolean;
    className?: string;

    // Controlled mode
    value?: string;
    onChange?: (value: string) => void;
};

/**
 * Wrapper around Base UI's `OTPField`. Renders `length` digit cells with
 * built-in keyboard / paste / focus management; the only thing we keep on
 * top is the explicit "Coller" button (clipboard read with a permission
 * fallback toast) since `navigator.clipboard.readText` requires a user
 * gesture and isn't covered by the in-field paste handler on every browser.
 */
export default function InputOtp(props: InputOtpProps) {
    const { length = 6, onComplete, disabled = false, className, value, onChange } = props;
    const toast = useToast();

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const cleaned = text.replace(/\D/g, "").slice(0, length);
            if (cleaned.length === 0) return;
            onChange?.(cleaned);
            if (cleaned.length === length) onComplete(cleaned);
        } catch {
            toast.add({
                title: "Accès au presse-papier refusé",
                description: "Autorisez l'accès au presse-papier dans les paramètres de votre navigateur.",
                type: "error",
            });
        }
    };

    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            <OTPField.Root
                length={length}
                value={value}
                onValueChange={onChange}
                onValueComplete={onComplete}
                disabled={disabled}
                validationType="numeric"
                inputMode="numeric"
                className="flex gap-2"
            >
                {Array.from({ length }).map((_, i) => (
                    <OTPField.Input
                        key={i}
                        autoComplete="one-time-code"
                        className={cn(
                            // Layout
                            "size-12 p-0",
                            // Border
                            "rounded-md border border-gray-200",
                            // Outline
                            "outline-2 outline-transparent",
                            "focus-visible:outline-outline",
                            // Background
                            "bg-background",
                            // Text
                            "text-center text-lg font-semibold text-gray-900",
                            // State
                            "data-disabled:bg-gray-50",
                            // Form Field state
                            "group-data-disabled/field:bg-gray-50",
                            "group-data-invalid/field:border-red-800",
                        )}
                    />
                ))}
            </OTPField.Root>
            <Button label="Coller" onClick={handlePasteFromClipboard} disabled={disabled} colors="outline" padding="sm">
                Coller
                <ClipboardPaste className="size-4" />
            </Button>
        </div>
    );
}
