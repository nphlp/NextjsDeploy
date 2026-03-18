"use client";

import cn from "@lib/cn";
import { Check } from "lucide-react";
import { CheckboxProps, Indicator, Root } from "./atoms";

type CheckboxChipProps = {
    label: string;
} & CheckboxProps;

export default function CheckboxChip(props: CheckboxChipProps) {
    const { label, className, children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <label
            className={cn(
                // Layout
                "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2",
                // Border
                "border border-gray-200",
                "hover:border-gray-300",
                "active:border-gray-400",
                // Background
                // "bg-gray-50",
                // "hover:bg-gray-100",
                // "active:bg-gray-200",
                // Outline
                "outline-2 outline-transparent",
                "has-focus-visible:outline-outline",
                // Overrides
                className,
            )}
        >
            <Root
                className={cn(
                    // Reset default checkbox styles
                    "size-4 rounded-sm",
                    "data-unchecked:border data-unchecked:border-gray-300",
                    "data-checked:bg-gray-900",
                    "outline-none",
                )}
                {...otherProps}
            >
                <Indicator className="text-gray-50">
                    <Check className="size-2.5" />
                </Indicator>
            </Root>
            <span className="text-foreground text-sm font-medium select-none">{label}</span>
        </label>
    );
}
