import { Input as InputBaseUi } from "@base-ui/react/input";
import cn from "@lib/cn";
import { ChangeEvent, FocusEvent, HTMLInputAutoCompleteAttribute, InputHTMLAttributes, Ref } from "react";

type InputProps = {
    type?: string;
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

export default function Input(props: InputProps) {
    const { type = "text", legacyProps, ...othersProps } = props;

    return (
        <InputBaseUi
            type={type}
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
    );
}

export const InputSkeleton = () => {
    return (
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
            <div className="h-5 w-24 flex-none rounded bg-gray-100"></div>
        </div>
    );
};
