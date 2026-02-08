"use client";

import cn from "@lib/cn";
import { ReactNode } from "react";
import { Description, Error, Label, Root, RootProps } from "./atoms";

type FieldProps = {
    label: string;
    description?: string;
    className?: string;
    subClassName?: {
        label?: string;
        description?: string;
        error?: string;
    };
    children?: ReactNode;
} & RootProps;

export default function Field(props: FieldProps) {
    const { label, description, className, subClassName, children, legacyProps, ...othersProps } = props;

    return (
        /**
         * ClassName "group/field" on <Root /> toggles 3 states via data attributes:
         * - Default: <Description /> (hidden once dirty)
         * - Invalid: <Error />       (invalid)
         */
        <Root className={cn("group/field", className)} {...othersProps} {...legacyProps}>
            <Label className={subClassName?.label}>{label}</Label>
            {children}
            <Description
                className={cn(
                    "group-data-dirty/field:hidden group-data-invalid/field:hidden",
                    subClassName?.description,
                )}
            >
                {description}
            </Description>
            <Error className={cn("hidden group-data-invalid/field:block", subClassName?.error)} match />
        </Root>
    );
}
