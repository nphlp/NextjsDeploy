"use client";

import { BaseUiProps, LegacyProps, StandardAttributes } from "@atoms/types";
import { Slider as SliderBaseUi } from "@base-ui/react/slider";
import cn from "@lib/cn";
import { ReactNode } from "react";

export type SliderProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes, "defaultValue">;
} & BaseUiProps<typeof SliderBaseUi.Root, StandardAttributes, "defaultValue">;

export const Root = (props: SliderProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SliderBaseUi.Root
            className={cn(
                // Layout
                "grid grid-cols-2",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SliderBaseUi.Root>
    );
};

type SliderControlProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SliderBaseUi.Control, StandardAttributes>;

export const Control = (props: SliderControlProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SliderBaseUi.Control
            className={cn(
                // Layout
                "col-span-2 flex cursor-pointer touch-none items-center py-3 select-none",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SliderBaseUi.Control>
    );
};

type SliderTrackProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SliderBaseUi.Track, StandardAttributes>;

export const Track = (props: SliderTrackProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SliderBaseUi.Track
            className={cn(
                // Layout
                "h-1 w-full rounded select-none",
                // Background
                "bg-gray-200",
                // Shadow
                "shadow-[inset_0_0_0_1px] shadow-gray-200",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SliderBaseUi.Track>
    );
};

type SliderIndicatorProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SliderBaseUi.Indicator, StandardAttributes>;

export const Indicator = (props: SliderIndicatorProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <SliderBaseUi.Indicator
            className={cn(
                // Layout
                "rounded select-none",
                // Background
                "bg-gray-700",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};

type SliderThumbProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SliderBaseUi.Thumb, StandardAttributes>;

export const Thumb = (props: SliderThumbProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <SliderBaseUi.Thumb
            className={cn(
                // Layout
                "size-4 rounded-full select-none",
                // Background
                "bg-white",
                // Border
                "outline-1 outline-gray-300",
                // State
                "has-focus-visible:outline-outline has-focus-visible:outline-2",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};

type SliderValueProps = {
    className?: string;
    children?: ((formattedValues: readonly string[], values: readonly number[]) => ReactNode) | null;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof SliderBaseUi.Value, StandardAttributes>;

export const Value = (props: SliderValueProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <SliderBaseUi.Value
            className={cn(
                // Text
                "text-foreground text-sm font-medium",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </SliderBaseUi.Value>
    );
};
