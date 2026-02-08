"use client";

import { DivLegacyProps, InputLegacyProps, LabelLegacyProps, ParagraphLegacyProps } from "@atoms/legacy-props";
import { Field as FieldBaseUI } from "@base-ui/react/field";
import cn from "@lib/cn";
import { ComponentProps, ReactNode } from "react";

export type RootProps = {
    className?: string;
    children?: ReactNode;
    legacyProps?: DivLegacyProps;
} & Omit<ComponentProps<typeof FieldBaseUI.Root>, keyof DivLegacyProps>;

export const Root = (props: RootProps) => {
    const { className, children, legacyProps, ...fieldProps } = props;

    return (
        <FieldBaseUI.Root
            className={cn("flex w-full flex-col items-start gap-1", className)}
            {...fieldProps}
            {...legacyProps}
        >
            {children}
        </FieldBaseUI.Root>
    );
};

type LabelProps = {
    className?: string;
    children?: ReactNode;
    legacyProps?: LabelLegacyProps;
} & Omit<ComponentProps<typeof FieldBaseUI.Label>, keyof LabelLegacyProps>;

export const Label = (props: LabelProps) => {
    const { className, children, legacyProps, ...fieldProps } = props;

    return (
        <FieldBaseUI.Label
            className={cn("text-sm font-medium text-gray-900", className)}
            {...fieldProps}
            {...legacyProps}
        >
            {children}
        </FieldBaseUI.Label>
    );
};

type ControlProps = {
    legacyProps?: InputLegacyProps;
} & Omit<ComponentProps<typeof FieldBaseUI.Control>, keyof InputLegacyProps>;

export const Control = (props: ControlProps) => {
    return <FieldBaseUI.Control {...props} />;
};

type DescriptionProps = {
    className?: string;
    children?: ReactNode;
    legacyProps?: ParagraphLegacyProps;
} & Omit<ComponentProps<typeof FieldBaseUI.Description>, keyof ParagraphLegacyProps>;

export const Description = (props: DescriptionProps) => {
    const { className, children, legacyProps, ...fieldProps } = props;

    return (
        <FieldBaseUI.Description className={cn("text-xs text-gray-600", className)} {...fieldProps} {...legacyProps}>
            {children}
        </FieldBaseUI.Description>
    );
};

type ErrorProps = {
    className?: string;
    legacyProps?: ParagraphLegacyProps;
} & Omit<ComponentProps<typeof FieldBaseUI.Error>, keyof ParagraphLegacyProps>;

export const Error = (props: ErrorProps) => {
    const { className, legacyProps, ...fieldProps } = props;

    return <FieldBaseUI.Error className={cn("text-xs text-red-800", className)} {...fieldProps} {...legacyProps} />;
};
