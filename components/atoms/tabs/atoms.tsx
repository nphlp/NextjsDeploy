"use client";

import { Tabs as TabsBaseUI } from "@base-ui/react/tabs";
import cn from "@lib/cn";
import { ComponentProps, ReactNode } from "react";

export type TabsProps = { children?: ReactNode } & ComponentProps<typeof TabsBaseUI.Root>;

export const Root = (props: TabsProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <TabsBaseUI.Root
            className={cn(
                // Border
                "rounded-md border border-gray-200",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </TabsBaseUI.Root>
    );
};

export const List = (props: { className?: string; children: ReactNode }) => {
    const { className, children } = props;

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
        >
            {children}
        </TabsBaseUI.List>
    );
};

export const Tab = (props: { value: string; disabled?: boolean; className?: string; children: ReactNode }) => {
    const { value, disabled, className, children } = props;

    return (
        <TabsBaseUI.Tab
            value={value}
            disabled={disabled}
            className={cn(
                // Layout
                "flex h-8 items-center justify-center px-2",
                // Border
                "border-0 outline-none",
                "before:outline-outline before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1",
                "focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2",
                // Text
                "text-sm font-medium break-keep whitespace-nowrap select-none",
                "text-gray-600",
                "hover:text-gray-900",
                "data-active:text-gray-900",
                // Overrides
                className,
            )}
        >
            {children}
        </TabsBaseUI.Tab>
    );
};

export const Indicator = (props: { className?: string }) => {
    const { className } = props;

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
                "bg-gray-100",
                // Animation
                "transition-all duration-200 ease-in-out",
                // Overrides
                className,
            )}
        />
    );
};

export const Panel = (props: { value: string; className?: string; children: ReactNode }) => {
    const { value, className, children } = props;

    return (
        <TabsBaseUI.Panel
            value={value}
            className={cn(
                // Layout
                "relative",
                // Border
                "outline-outline -outline-offset-1",
                "focus-visible:rounded-md focus-visible:outline-2",
                // Overrides
                className,
            )}
        >
            {children}
        </TabsBaseUI.Panel>
    );
};
