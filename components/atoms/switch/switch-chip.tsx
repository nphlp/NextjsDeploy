"use client";

import cn from "@lib/cn";
import { ReactNode } from "react";
import { Root, SwitchProps, Thumb } from "./atoms";

type SwitchChipProps = {
    label: string;
    checkedLabel?: string;
    icon?: ReactNode;
    checkedIcon?: ReactNode;
} & SwitchProps;

export default function SwitchChip(props: SwitchChipProps) {
    const { label, checkedLabel, icon, checkedIcon, className, children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root
            className={cn(
                // Layout
                "group h-8 w-auto gap-2 rounded-full px-3",
                // Border
                "border border-gray-200",
                "data-checked:border-gray-300",
                // Background
                "bg-gray-50",
                "data-checked:bg-gray-900",
                // Shadow
                "inset-shadow-none data-checked:inset-shadow-none",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {icon && <span className="text-gray-600 group-data-checked:text-gray-300">{icon}</span>}
            {checkedIcon && <span className="hidden text-gray-300 group-data-checked:inline">{checkedIcon}</span>}
            <span className={cn("text-sm font-medium select-none", "text-gray-700 group-data-checked:text-gray-100")}>
                {checkedLabel ? (
                    <>
                        <span className="group-data-checked:hidden">{label}</span>
                        <span className="hidden group-data-checked:inline">{checkedLabel}</span>
                    </>
                ) : (
                    label
                )}
            </span>
            <Thumb className="size-4 data-checked:translate-x-0" />
        </Root>
    );
}
