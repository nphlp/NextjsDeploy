import { Field } from "@base-ui/react/field";
import cn from "@lib/cn";
import {
    ChangeEvent,
    ComponentProps,
    FocusEvent,
    HTMLInputAutoCompleteAttribute,
    InputHTMLAttributes,
    Ref,
} from "react";

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
    ref?: Ref<HTMLTextAreaElement>;

    // Event
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;

    // Legacy props
    legacyProps?: Omit<InputHTMLAttributes<HTMLTextAreaElement>, keyof InputProps>;
} & ComponentProps<typeof Field.Control>;

export default function TextArea(props: InputProps) {
    const { legacyProps, ...othersProps } = props;

    return (
        <Field.Control
            render={<textarea />}
            className={cn(
                // Text area specific
                "field-sizing-content resize-none",
                // Layout
                "min-h-16.5 w-full",
                // Border
                "rounded-md border border-gray-200",
                // Padding
                "px-3.5 py-2",
                // Text
                "text-base leading-6 text-gray-900",
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

export const TextAreaSkeleton = () => {
    return (
        <div
            className={cn(
                "animate-pulse",
                // Layout
                "h-16.5 w-full",
                // Border
                "rounded-md border border-gray-200",
                // Padding
                "px-3.5 py-2.25",
            )}
        >
            <div className="h-5 w-32 flex-none rounded bg-gray-100"></div>
        </div>
    );
};
