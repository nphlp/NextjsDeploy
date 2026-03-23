"use client";

import cn from "@lib/cn";
import { Root, SwitchProps, Thumb } from "./atoms";

type SwitchChipProps = {
    text: string;
    className?: string;
} & Omit<SwitchProps, "className" | "children">;

export default function SwitchChip(props: SwitchChipProps) {
    const { text, className, ...otherProps } = props;

    return (
        <label
            className={cn(
                // Layout
                "flex cursor-pointer items-center gap-3 rounded-full px-4 py-2",
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
            <span className="text-foreground text-sm font-medium select-none">{text}</span>
            <Root {...otherProps}>
                <Thumb />
            </Root>
        </label>
    );
}
