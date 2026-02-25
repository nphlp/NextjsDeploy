"use client";

import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { Tabs as TabsBaseUI } from "@base-ui/react/tabs";
import cn from "@lib/cn";
import { MouseEventHandler, ReactNode } from "react";

export type TabsProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TabsBaseUI.Root, StandardAttributes, "defaultValue">;

export const Root = (props: TabsProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TabsBaseUI.Root
            className={cn(
                // Border
                "rounded-md border border-gray-200",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </TabsBaseUI.Root>
    );
};

type TabsListProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TabsBaseUI.List, StandardAttributes>;

export const List = (props: TabsListProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TabsBaseUI.List
            className={cn(
                // Layout
                "relative z-0 flex gap-1 px-1",
                // Border
                "shadow-[inset_0_-1px] shadow-gray-200",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </TabsBaseUI.List>
    );
};

type TabsTabProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof TabsBaseUI.Tab, ButtonAttributes, "value">;

export const Tab = (props: TabsTabProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TabsBaseUI.Tab
            className={cn(
                // Layout
                "flex h-8 items-center justify-center px-2",
                // Border
                "border-0 outline-none",
                "before:outline-outline before:inset-x-0 before:inset-y-1 before:rounded-sm before:outline-offset-0",
                "focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2",
                // Text
                "cursor-pointer text-sm font-medium break-keep whitespace-nowrap select-none",
                "text-gray-600",
                "hover:text-gray-900",
                "data-active:text-gray-900",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </TabsBaseUI.Tab>
    );
};

type TabsIndicatorProps = {
    className?: string;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TabsBaseUI.Indicator, StandardAttributes>;

export const Indicator = (props: TabsIndicatorProps) => {
    const { className, legacyProps, ...otherProps } = props;

    return (
        <TabsBaseUI.Indicator
            renderBeforeHydration
            className={cn(
                // Layout
                "absolute top-1/2 left-0 z-[-1] h-6",
                "w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2",
                // Border
                "rounded-sm",
                // Background
                "bg-gray-100/60",
                // Animation
                "transition-all duration-200 ease-in-out",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        />
    );
};

type TabsPanelProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof TabsBaseUI.Panel, StandardAttributes>;

export const Panel = (props: TabsPanelProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <TabsBaseUI.Panel
            className={cn(
                // Layout
                "relative",
                // Border
                "outline-outline -outline-offset-2",
                "focus-visible:rounded-md focus-visible:outline-2",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </TabsBaseUI.Panel>
    );
};
