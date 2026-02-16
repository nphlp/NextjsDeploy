"use client";

import { BaseUiProps, LegacyProps, StandardAttributes } from "@atoms/types";
import { Switch as SwitchBaseUi } from "@base-ui/react/switch";
import cn from "@lib/cn";
import { ReactNode } from "react";

export type SwitchProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SwitchBaseUi.Root, StandardAttributes, "defaultChecked">;

export const Root = (props: SwitchProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SwitchBaseUi.Root
            className={cn(
                // Layout
                "relative flex h-6 w-10 cursor-pointer rounded-full",
                // Border
                "border-2 outline-0",
                // Background
                "border-gray-200 bg-gray-200",
                "data-checked:border-gray-500 data-checked:bg-gray-500",
                // Shadow
                // "shadow-[inset_0_1.5px_2px_var(--color-gray-200)]",
                // Animation
                "transition-all duration-150 ease-in-out",
                // State
                "before:outline-outline before:absolute before:rounded-full before:outline-offset-2",
                "focus-visible:before:inset-0 focus-visible:before:outline-2",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SwitchBaseUi.Root>
    );
};

type SwitchThumbProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SwitchBaseUi.Thumb, StandardAttributes>;

export const Thumb = (props: SwitchThumbProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <SwitchBaseUi.Thumb
            className={cn(
                // Layout
                "aspect-square h-full rounded-full",
                // Background
                "bg-white",
                // Shadow
                // "shadow-[0_0_1px_1px_var(--color-gray-100),0_1px_1px_var(--color-gray-100),1px_2px_4px_-1px_var(--color-gray-100)]",
                // Animation
                "transition-transform duration-150",
                "data-checked:translate-x-4",
                // Dark
                // "dark:shadow-[0_0_1px_1px_rgb(0_0_0/0.25),0_1px_1px_rgb(0_0_0/0.25),1px_2px_4px_-1px_rgb(0_0_0/0.25)]",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};
