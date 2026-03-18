/**
 * @see https://base-ui.com/react/components/accordion
 */
import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { Accordion as AccordionBaseUi } from "@base-ui/react/accordion";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";

export type AccordionProps = {
    className?: string;
    children?: ReactNode;
} & ComponentProps<typeof AccordionBaseUi.Root>;

export const Root = (props: AccordionProps) => {
    const { className, children, ...otherProps } = props;

    return (
        <AccordionBaseUi.Root
            className={cn(
                // Layout
                "flex w-full max-w-96 flex-col justify-center",
                // Text
                "text-foreground",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AccordionBaseUi.Root>
    );
};

type AccordionItemProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AccordionBaseUi.Item, StandardAttributes>;

export const Item = (props: AccordionItemProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AccordionBaseUi.Item
            className={cn(
                // Border
                "border-b border-gray-200",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AccordionBaseUi.Item>
    );
};

type AccordionHeaderProps = {
    children?: ReactNode;
} & ComponentProps<typeof AccordionBaseUi.Header>;

export const Header = (props: AccordionHeaderProps) => {
    const { children, ...otherProps } = props;

    return <AccordionBaseUi.Header {...otherProps}>{children}</AccordionBaseUi.Header>;
};

type AccordionTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof AccordionBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: AccordionTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AccordionBaseUi.Trigger
            className={cn(
                // Layout
                "group relative flex w-full items-baseline justify-between gap-4",
                "py-2 pr-1 pl-3",
                // Background
                "bg-gray-50",
                "hover:bg-gray-100",
                // Text
                "text-left font-medium",
                // Outline
                "outline-2 outline-transparent",
                // State
                "focus-visible:outline-outline focus-visible:z-1",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AccordionBaseUi.Trigger>
    );
};

type AccordionPanelProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AccordionBaseUi.Panel, StandardAttributes>;

export const Panel = (props: AccordionPanelProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AccordionBaseUi.Panel
            className={cn(
                // Layout
                "h-(--accordion-panel-height) overflow-hidden",
                // Text
                "text-base text-gray-600",
                // Animation
                "transition-[height] ease-out",
                "data-ending-style:h-0 data-starting-style:h-0",
                // Overrides
                className,
            )}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AccordionBaseUi.Panel>
    );
};
