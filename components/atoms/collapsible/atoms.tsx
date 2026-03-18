/**
 * @see https://base-ui.com/react/components/collapsible
 */

"use client";

import { BaseUiProps, ButtonAttributes, ButtonStyleProps, LegacyProps, StandardAttributes } from "@atoms/types";
import { Collapsible as CollapsibleBaseUi } from "@base-ui/react/collapsible";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { buttonStyle } from "../button/button-variants";

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
} & ButtonStyleProps &
    BaseUiProps<typeof CollapsibleBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: CollapsibleTriggerProps) => {
    const {
        className,
        children,
        // Style props
        colors = "outline",
        rounded = "md",
        padding = "sm",
        noFlex = false,
        noOutline = false,
        noStyle = false,
        // Others
        legacyProps,
        ...otherProps
    } = props;

    return (
        <CollapsibleBaseUi.Trigger
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), "group", className)}
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
