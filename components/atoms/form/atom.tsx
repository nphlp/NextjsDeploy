"use client";

import cn from "@lib/cn";
import { HTMLAttributes, ReactNode } from "react";
import { FieldStatus } from "./use-form";

// ----- Utilities ----- //

function showError(status: FieldStatus): boolean {
    const { isValid, isEmpty, isTouched, isFocus } = status;
    // Show error when invalid and touched, except while typing in empty field
    return !isValid && isTouched && !(isEmpty && isFocus);
}

function showDescription(status: FieldStatus): boolean {
    const { isValid, isEmpty, isTouched, isFocus } = status;
    // Show description when valid, or when empty and either untouched or focused
    return isValid || (isEmpty && (!isTouched || isFocus));
}

// ----- Types ----- //

export type FieldProps = {
    label?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
};

// ----- Atoms ----- //

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
    status: FieldStatus;
    errors: string[];
    description?: string;
    className?: string;
};

export const Indication = (props: IndicationProps) => {
    const { status, errors, description, className } = props;

    return (
        <>
            {showDescription(status) && <p className={cn("text-xs text-gray-600", className)}>{description}</p>}
            {showError(status) && (
                <p className={cn("text-xs text-red-800", className)}>{errors[0] ?? "Champ invalide..."}</p>
            )}
        </>
    );
};

// ----- Field Wrapper (internal, for adapters) ----- //

export type FieldWrapperProps = FieldProps & {
    name: string;
    status: FieldStatus;
    errors: string[];
    children: ReactNode;
};

export const FieldWrapper = (props: FieldWrapperProps) => {
    const { name, label, description, disabled, required, status, errors, children } = props;

    return (
        <div
            className={cn("group/field", "flex w-full flex-col items-start gap-1")}
            data-invalid={showError(status) ? true : undefined}
            data-disabled={disabled ? true : undefined}
        >
            {label && <Label label={label} name={name} required={required} />}
            {children}
            <Indication status={status} errors={errors} description={description} />
        </div>
    );
};
