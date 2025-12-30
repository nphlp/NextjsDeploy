"use client";

import { FieldRootProps } from "@base-ui/react";
import { ReactNode } from "react";
import { Control, Description, Error, Label, Root } from "./atoms";

type FieldProps = {
    className?: string;
    children?: ReactNode;
} & FieldRootProps;

export default function Field(props: FieldProps) {
    const { className, children, ...fieldProps } = props;

    if (children)
        return (
            <Root className={className} {...fieldProps}>
                {children}
            </Root>
        );

    return (
        <Root>
            <Label>Label</Label>
            <Control />
            <Error />
            <Description>Veuillez remplir ce champ</Description>
        </Root>
    );
}
