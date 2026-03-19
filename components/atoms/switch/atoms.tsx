/**
 * @see https://base-ui.com/react/components/switch
 */

"use client";

import { BaseUiProps, LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { Switch as SwitchBaseUi } from "@base-ui/react/switch";
import cn from "@lib/cn";
import { ReactNode } from "react";

export type SwitchProps = {
    id?: string;

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
                "relative flex h-6 w-10 flex-none cursor-pointer rounded-full",
                // Border
                "border outline-0",
                // Background
                "border-gray-100 bg-gray-200",
                "data-checked:border-gray-300 data-checked:bg-gray-500",
                // Shadow
                "inset-shadow-[1px_1px_3px_0px_var(--color-gray-500)]",
                "data-checked:inset-shadow-[1px_1px_3px_0px_var(--color-gray-700)]",
                // Animation
                "transition-all duration-150 ease-in-out",
                // Outline (before: pseudo-element)
                "before:absolute before:rounded-full before:outline-2 before:outline-offset-1 before:outline-transparent",
                "focus-visible:before:outline-outline focus-visible:before:inset-0",
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
                "inset-shadow-[0px_0px_1.5px_1px_var(--color-gray-50)]",
                // Animation
                "transition-transform duration-150",
                "data-checked:translate-x-4",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};
