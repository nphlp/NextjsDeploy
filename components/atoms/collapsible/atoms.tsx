"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { Collapsible as CollapsibleBaseUi } from "@base-ui/react/collapsible";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

export type CollapsibleProps = {
    children?: ReactNode;
} & ComponentProps<typeof CollapsibleBaseUi.Root>;

export const Root = (props: CollapsibleProps) => {
    const { children, ...otherProps } = props;

    return <CollapsibleBaseUi.Root {...otherProps}>{children}</CollapsibleBaseUi.Root>;
};

type CollapsibleTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof CollapsibleBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: CollapsibleTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <CollapsibleBaseUi.Trigger
            className={cn(
                // Layout
                "group flex items-center gap-2 rounded-md px-2 py-1",
                // Border
                "border border-gray-200",
                "hover:border-gray-300",
                "active:border-gray-400",
                // Background
                "bg-gray-50",
                "hover:bg-gray-100",
                "active:bg-gray-200",
                // Text
                "text-sm font-medium text-gray-900",
                // Cursor
                "cursor-pointer",
                // Animation
                "transition-all duration-100 ease-in-out",
                // State
                "focus-visible:outline-outline focus-visible:outline-2 focus-visible:outline-offset-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </CollapsibleBaseUi.Trigger>
    );
};

type CollapsiblePanelProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof CollapsibleBaseUi.Panel, StandardAttributes>;

export const Panel = (props: CollapsiblePanelProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <CollapsibleBaseUi.Panel
            className={cn(
                // Layout
                "flex h-(--collapsible-panel-height) flex-col justify-end overflow-hidden",
                // Text
                "text-sm",
                // Animation
                "transition-all duration-150 ease-out",
                "data-ending-style:h-0 data-starting-style:h-0",
                // Hidden until found
                "[&[hidden]:not([hidden='until-found'])]:hidden",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </CollapsibleBaseUi.Panel>
    );
};
