"use client";

import { Field as FieldBaseUI } from "@base-ui/react/field";
import { ReactNode } from "react";

type FieldProps = {
    label: string;
    description?: string;
    children?: ReactNode;
};

export default function Field(props: FieldProps) {
    const { label, description, children } = props;

    return (
        <Root className="flex w-full max-w-64 flex-col items-start gap-1" validationMode="onChange">
            <Label className="text-sm font-medium text-gray-900">{label}</Label>

            {children ?? <Control />}

            <Error className="text-sm text-red-800" />

            {description && <Description className="text-sm text-gray-600">{description}</Description>}
        </Root>
    );
}

const { Root, Label, Error, Description } = FieldBaseUI;

const Control = () => (
    <FieldBaseUI.Control
        className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        placeholder="Required"
        required
    />
);
