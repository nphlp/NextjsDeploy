import { Combobox as ComboboxBaseUi } from "@base-ui/react/combobox";
import cn from "@lib/cn";
import { X } from "lucide-react";
import { ComponentProps, ReactNode, RefObject } from "react";

// ─── Value (behavior-only, render function) ─────────────────────

type ValueProps = ComponentProps<typeof ComboboxBaseUi.Value>;

export const Value = (props: ValueProps) => {
    return <ComboboxBaseUi.Value {...props} />;
};

// ─── ChipsContainer ─────────────────────────────────────────────

type ChipsContainerProps = {
    className?: string;
    children?: ReactNode;
    ref?: RefObject<HTMLDivElement | null>;
} & Omit<ComponentProps<typeof ComboboxBaseUi.Chips>, "ref">;

export const ChipsContainer = (props: ChipsContainerProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Chips
            className={cn(
                // Layout
                "flex w-64 flex-wrap items-center gap-0.5 rounded-md px-1.5 py-1",
                // Border
                "border border-gray-200",
                // Outline
                "outline-2 outline-transparent",
                // State
                "focus-within:outline-outline",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Chips>
    );
};

// ─── ChipsInput ─────────────────────────────────────────────────

type ChipsInputProps = {
    className?: string;
} & ComponentProps<typeof ComboboxBaseUi.Input>;

export const ChipsInput = (props: ChipsInputProps) => {
    const { className, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Input
            className={cn(
                // Layout
                "h-8 min-w-16 flex-1 px-1",
                // Text
                "text-foreground text-base font-normal",
                // Outline
                "outline-none",
                // Overrides
                className,
            )}
            {...otherProps}
        />
    );
};

// ─── MultipleChip ───────────────────────────────────────────────

type MultipleChipProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof ComboboxBaseUi.Chip>;

export const MultipleChip = (props: MultipleChipProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ComboboxBaseUi.Chip
            className={cn(
                // Layout
                "flex cursor-default items-center gap-1 rounded-md px-1.5 py-[0.2rem]",
                // Background
                "bg-gray-100",
                // Text
                "text-foreground text-sm outline-none",
                // State
                "[@media(hover:hover)]:data-highlighted:bg-gray-900 [@media(hover:hover)]:data-highlighted:text-gray-50",
                "focus-within:bg-gray-900 focus-within:text-gray-50",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </ComboboxBaseUi.Chip>
    );
};

// ─── MultipleChipRemove ─────────────────────────────────────────

type MultipleChipRemoveProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof ComboboxBaseUi.ChipRemove>;

export const MultipleChipRemove = (props: MultipleChipRemoveProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <ComboboxBaseUi.ChipRemove
            className={cn(
                // Layout
                "rounded-md p-1",
                // Text
                "text-inherit",
                // State
                "hover:bg-gray-200",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children ?? <X className="size-3" />}
        </ComboboxBaseUi.ChipRemove>
    );
};
