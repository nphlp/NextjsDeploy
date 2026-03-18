/**
 * @see https://base-ui.com/react/components/checkbox
 */
import { Checkbox as CheckboxBaseUi } from "@base-ui/react/checkbox";
import cn from "@lib/cn";
import { Check } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

export type CheckboxProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof CheckboxBaseUi.Root>;

export const Root = (props: CheckboxProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <CheckboxBaseUi.Root
            className={cn(
                // Layout
                "flex size-5 items-center justify-center",
                // Border
                "rounded-sm",
                "data-unchecked:border data-unchecked:border-gray-300",
                // Background
                "data-checked:bg-gray-900",
                // Outline
                "outline-2 outline-transparent",
                // State
                "focus-visible:outline-outline focus-visible:outline-offset-2",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </CheckboxBaseUi.Root>
    );
};

type CheckboxIndicatorProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof CheckboxBaseUi.Indicator>;

export const Indicator = (props: CheckboxIndicatorProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <CheckboxBaseUi.Indicator
            className={cn(
                // Layout
                "flex",
                // Text
                "text-gray-50",
                // State
                "data-unchecked:hidden",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children ?? <Check className="size-3" />}
        </CheckboxBaseUi.Indicator>
    );
};
