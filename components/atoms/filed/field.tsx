"use client";

import { FieldRootProps } from "@base-ui/react";
import { ReactNode } from "react";
import { Control, Description, Error, Label, Root } from "./atoms";

type FieldProps = {
    label: string;
    description?: string;
    error?: string;
    className?: string;
    children?: ReactNode;
} & Omit<FieldRootProps, "invalid">;

export default function Field(props: FieldProps) {
    const { className, children, label, description, error, ...fieldProps } = props;

    const hasError = !!error;

    if (children) {
        return (
            <Root className={className} invalid={hasError} {...fieldProps}>
                <Label>{label}</Label>
                {children}
                {hasError ? <Error match>{error}</Error> : description && <Description>{description}</Description>}
            </Root>
        );
    }

    return (
        <Root>
            <Label>Label</Label>
            <Control />
            <Description>Veuillez remplir ce champ</Description>
            <Error>Erreur</Error>
        </Root>
    );
}
