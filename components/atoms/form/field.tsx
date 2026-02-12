"use client";

import cn from "@lib/cn";
import { HTMLAttributes, ReactNode } from "react";
import { useFormContext } from "./_context/use-form-context";

export type RootProps = {
    name: string;
    label: string;
    description: string;
    className?: string;
    children?: ReactNode;
    disabled?: boolean;
    required?: boolean;
    legacyProps?: HTMLAttributes<HTMLDivElement>;
};

export const Field = (props: RootProps) => {
    const { name, label, description, className, children, disabled, required = false, legacyProps } = props;

    const register = useFormContext();
    const { status } = register(name);

    const { isValid, isEmpty, isTouched, isFocus } = status;

    const isInvalid = !isValid;
    const isWriting = isFocus;

    const showError = (isEmpty && !isWriting && isInvalid && isTouched) || (!isEmpty && isInvalid && isTouched);

    return (
        <div
            className={cn(
                // Used to provide "data-invalid" attribute state to "group/field" child
                "group/field",
                "flex w-full flex-col items-start gap-1",
                className,
            )}
            // Data attributes for child styling via group-data-*/field:
            data-invalid={showError ? true : undefined}
            data-disabled={disabled ? true : undefined}
            {...legacyProps}
        >
            <Label label={label} name={name} required={required} />
            {children}
            <Indication name={name} description={description} />
        </div>
    );
};

type LabelProps = {
    label: string;
    name: string;
    className?: string;
    required?: boolean;
    legacyProps?: HTMLAttributes<HTMLLabelElement>;
};

export const Label = (props: LabelProps) => {
    const { label, name, className, required, legacyProps } = props;

    return (
        <label
            htmlFor={name}
            className={cn("text-sm font-medium text-gray-900", "flex gap-0.5", className)}
            {...legacyProps}
        >
            {label}
            {required && <span className="text-red-600">*</span>}
        </label>
    );
};

type RequiredNoteProps = {
    className?: string;
    classNameLabel?: string;
    classNameText?: string;
};

export const RequiredNote = (props: RequiredNoteProps) => {
    const { className, classNameLabel, classNameText } = props;
    return (
        <div className={cn("flex items-center justify-end gap-0.5", className)}>
            <p className={cn("text-red-600", classNameLabel)}>*</p>
            <p className={cn("text-xs text-gray-600", classNameText)}>champs obligatoires</p>
        </div>
    );
};

type IndicationProps = {
    name: string;
    description: string;
    className?: string;
};

export const Indication = (props: IndicationProps) => {
    const { name, description, className } = props;

    const register = useFormContext();
    const { errors, status } = register(name);

    const { isValid, isEmpty, isTouched, isFocus } = status;

    const isInvalid = !isValid;
    const isWriting = isFocus;

    const showDescription = (isEmpty && !isTouched) || (isEmpty && isTouched && isWriting) || isValid;
    const showError = (isEmpty && !isWriting && isInvalid && isTouched) || (!isEmpty && isInvalid && isTouched);

    return (
        <>
            {showDescription && <p className={cn("text-xs text-gray-600", className)}>{description}</p>}
            {showError && <p className={cn("text-xs text-red-800", className)}>{errors[0] ?? "Champ invalide..."}</p>}
        </>
    );
};
