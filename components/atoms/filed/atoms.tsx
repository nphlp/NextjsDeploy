"use client";

import { Field as FieldBaseUI, FieldRootProps } from "@base-ui/react/field";
import cn from "@lib/cn";
import { ComponentProps, InputHTMLAttributes, ReactNode } from "react";

export const Root = (props: { className?: string; children: ReactNode } & FieldRootProps) => {
    const { className, children, ...fieldProps } = props;

    return (
        <FieldBaseUI.Root className={cn("flex w-full flex-col items-start gap-1", className)} {...fieldProps}>
            {children}
        </FieldBaseUI.Root>
    );
};

export const Label = (props: { children: ReactNode }) => {
    const { children } = props;

    return <FieldBaseUI.Label className="text-sm font-medium text-gray-900">{children}</FieldBaseUI.Label>;
};

/**
 * Prefer using <Input />
 */
export const Control = (props: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <FieldBaseUI.Control
            className="focus:outline-outline h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1"
            {...props}
        />
    );
};

export const Description = (props: { children: ReactNode }) => {
    const { children } = props;

    return <FieldBaseUI.Description className="text-sm text-gray-600">{children}</FieldBaseUI.Description>;
};

type ErrorProps = {
    children?: ReactNode;
} & ComponentProps<typeof FieldBaseUI.Error>;

export const Error = (props: ErrorProps) => {
    const { children, ...otherProps } = props;

    return (
        <FieldBaseUI.Error className="text-sm text-red-800" {...otherProps}>
            {children}
        </FieldBaseUI.Error>
    );
};
