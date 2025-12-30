"use client";

import { Tabs as TabsBaseUI } from "@base-ui/react/tabs";
import cn from "@lib/cn";
import { ReactNode } from "react";

type TabsProps = {
    children: ReactNode;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
};

export function Tabs(props: TabsProps) {
    const { children, defaultValue, value, onValueChange, className } = props;

    return (
        <TabsBaseUI.Root
            defaultValue={defaultValue}
            value={value}
            onValueChange={(value) => onValueChange?.(value as string)}
            className={className}
        >
            {children}
        </TabsBaseUI.Root>
    );
}

type TabsListProps = {
    children: ReactNode;
    className?: string;
};

export function TabsList(props: TabsListProps) {
    const { children, className } = props;

    return (
        <TabsBaseUI.List
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
                className,
            )}
        >
            {children}
        </TabsBaseUI.List>
    );
}

type TabsTriggerProps = {
    children: ReactNode;
    value: string;
    className?: string;
};

export function TabsTrigger(props: TabsTriggerProps) {
    const { children, value, className } = props;

    return (
        <TabsBaseUI.Tab
            value={value}
            className={cn(
                "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-offset-white transition-all",
                "focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:outline-none",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-[selected]:bg-white data-[selected]:text-gray-950 data-[selected]:shadow-sm",
                className,
            )}
        >
            {children}
        </TabsBaseUI.Tab>
    );
}

type TabsContentProps = {
    children: ReactNode;
    value: string;
    className?: string;
};

export function TabsContent(props: TabsContentProps) {
    const { children, value, className } = props;

    return (
        <TabsBaseUI.Panel
            value={value}
            className={cn(
                "mt-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:outline-none",
                className,
            )}
        >
            {children}
        </TabsBaseUI.Panel>
    );
}
