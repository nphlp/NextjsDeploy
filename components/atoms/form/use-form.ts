"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ZodType } from "zod";

/**
 * Per-field configuration.
 *
 * @template V — The field value type, inferred from `setter` return type.
 *
 * @property schema — Default Zod schema. Used on submit, onBlur and onChange (unless overridden).
 * @property onChangeSchema — Optional override for onChange validation (e.g. lenient progressive regex).
 * @property onBlurSchema — Optional override for onBlur validation.
 * @property setter — Value transformer. Its return type drives `FieldValue` inference (e.g. `string | null`).
 * @property defaultValue — Initial value for the field.
 */
type FieldConfig<V> = {
    /** Default Zod schema. Used on submit, onBlur and onChange (unless overridden). */
    schema: ZodType;
    /** Optional override for onChange validation (e.g. lenient progressive regex). */
    onChangeSchema?: ZodType;
    /** Optional override for onBlur validation. */
    onBlurSchema?: ZodType;
    /** Value transformer. Its return type drives `FieldValue` inference (e.g. `string | null`). */
    setter: (value: V) => V;
    /** Initial value for the field. */
    defaultValue: V;
};

/**
 * Form config shape: a record of field names to their `FieldConfig`.
 * Uses `any` because each field carries its own generic — the real types
 * are recovered per-field via `FieldValue` and `SchemaValue` conditional types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseFormProps = Record<string, FieldConfig<any>>;

/** Extracts field names from config as string literal union. */
type FieldName<T extends UseFormProps> = keyof T & string;

/** Extracts the field value type from `setter` return type. Used by `register` (value, onChange). */
type FieldValue<F> = F extends FieldConfig<infer V> ? V : never;

/** Extracts the validated output type from `schema`. Used by `submit` return. */
type SchemaValue<F> = F extends { schema: ZodType<infer S> } ? S : never;

/** Maps each field name to a uniform type U (e.g. `string[]` for errors, `FieldStatus` for status). */
type FieldObject<T extends UseFormProps, U> = {
    [K in FieldName<T>]: U;
};

/**
 * Parallel boolean flags describing a field's current state.
 *
 * @property isValid — Last validation passed (onChange, onBlur or submit).
 * @property isEmpty — Value is empty string, null, undefined or empty array.
 * @property isFocus — Field is currently focused.
 * @property isTouched — Field has been interacted with (focus, change or blur).
 */
export type FieldStatus = {
    /** Last validation passed (onChange, onBlur or submit). */
    isValid: boolean;
    /** Value is empty string, null, undefined or empty array. */
    isEmpty: boolean;
    /** Field is currently focused. */
    isFocus: boolean;
    /** Field has been interacted with (focus, change or blur). */
    isTouched: boolean;
};

/** Internal state shape: maps each field to its `FieldValue` (from setter). */
type Values<T extends UseFormProps> = { [K in FieldName<T>]: FieldValue<T[K]> };

/** Submit return shape: maps each field to its `SchemaValue` (from Zod schema output). */
type ValidatedValues<T extends UseFormProps> = { [K in FieldName<T>]: SchemaValue<T[K]> };

/**
 * Return type of `useForm`.
 *
 * @property register — Returns field props (name, value, onChange, onBlur, onFocus, errors, status) for a given field key.
 * @property submit — Validates all fields with the strict `schema`. Returns `ValidatedValues<T>` on success, `undefined` on failure.
 * @property reset — Resets all values, errors and status to their default state.
 */
export type UseFormReturn<T extends UseFormProps> = {
    /** Returns field props (name, value, onChange, onBlur, onFocus, errors, status) for a given field key. */
    register: <K extends FieldName<T>>(
        fieldName: K,
    ) => {
        /** Field key as string literal. */
        name: K;
        /** Current field value, typed via `FieldValue` (from setter). */
        value: FieldValue<T[K]>;
        /** Parallel boolean flags: isValid, isEmpty, isFocus, isTouched. */
        status: FieldStatus;
        /** Validation error messages from the last onChange, onBlur or submit. */
        errors: string[];
        /** Marks field as focused and touched. */
        onFocus: () => void;
        /** Validates with `onBlurSchema` (or `schema` fallback) and removes focus. */
        onBlur: () => void;
        /** Updates value through setter, then validates with `onChangeSchema` (or `schema` fallback). */
        onChange: Dispatch<SetStateAction<FieldValue<T[K]>>>;
    };
    /** Validates all fields with the strict `schema`. Returns `ValidatedValues<T>` on success, `undefined` on failure. */
    submit: () => ValidatedValues<T> | undefined;
    /** Resets all values, errors and status to their default state. */
    reset: () => void;
};

/**
 * Lightweight form hook with full type inference from config.
 *
 * Features:
 * - Field keys, values and validated output are inferred from config
 * - Per-field Zod validation with optional schema overrides for onChange and onBlur
 * - Setter function for value transformation and type inference (e.g. `string | null`)
 * - Field status tracking: `isValid`, `isEmpty`, `isFocus`, `isTouched`
 * - Progressive validation: onChange uses `onChangeSchema` (lenient), onBlur/submit uses `schema` (strict)
 *
 * Type inference:
 * - `FieldValue<T[K]>` — inferred from `setter`, used by `register` (value, onChange)
 * - `SchemaValue<T[K]>` — inferred from `schema`, used by `submit` (validated output)
 *
 * @example
 * ```tsx
 * const { register, submit, reset } = useForm({
 *     name: {
 *         schema: z.string().min(1, "Required"),
 *         setter: (value: string) => value,
 *         defaultValue: "",
 *     },
 *     group: {
 *         schema: z.string("Select a group"),
 *         setter: (value: string | null) => value, // setter widens type for UI state
 *         defaultValue: null,
 *     },
 * });
 *
 * register("name").value   // string
 * register("group").value  // string | null
 * submit()?.name           // string
 * submit()?.group          // string (validated, not null)
 * ```
 */
export const useForm = <T extends UseFormProps>(config: T): UseFormReturn<T> => {
    const fieldsNames = Object.keys(config) as FieldName<T>[];

    // Default states
    const defaultValues = Object.fromEntries(
        fieldsNames.map((fieldName) => [fieldName, config[fieldName].defaultValue]),
    ) as Values<T>;

    const defaultErrors = Object.fromEntries(fieldsNames.map((fieldName) => [fieldName, []])) as unknown as FieldObject<
        T,
        string[]
    >;

    const defaultStatus = Object.fromEntries(
        fieldsNames.map((fieldName) => [
            fieldName,
            { isValid: false, isEmpty: true, isFocus: false, isTouched: false },
        ]),
    ) as FieldObject<T, FieldStatus>;

    // Centralized state
    const [values, setValues] = useState<Values<T>>(defaultValues);
    const [errors, setErrors] = useState<FieldObject<T, string[]>>(defaultErrors);
    const [status, setStatus] = useState<FieldObject<T, FieldStatus>>(defaultStatus);

    /**
     * Returns field props for a given field name.
     * Provides: name, value, onChange, onBlur, onFocus, errors, status.
     */
    const register = ((fieldName: FieldName<T>) => {
        const name = fieldName;
        const value = values[fieldName];

        // Mark field as focused and touched
        const onFocus = () => {
            setStatus((prev) => ({ ...prev, [fieldName]: { ...prev[fieldName], isFocus: true, isTouched: true } }));
        };

        // Update value through setter, then validate with onChangeSchema (or schema fallback)
        const onChange = (newValue: FieldValue<T[typeof fieldName]>) => {
            const transformed = config[fieldName].setter(newValue);
            setValues((prev) => ({ ...prev, [fieldName]: transformed }));

            const isEmpty =
                transformed === "" ||
                transformed === undefined ||
                transformed === null ||
                (Array.isArray(transformed) && transformed.length === 0);

            const onChangeSchema = config[fieldName].onChangeSchema || config[fieldName].schema;
            const result = onChangeSchema.safeParse(transformed);

            setErrors((prev) => ({
                ...prev,
                [fieldName]: result.success ? [] : result.error.issues.map((i) => i.message),
            }));
            setStatus((prev) => ({
                ...prev,
                [fieldName]: { ...prev[fieldName], isValid: result.success, isEmpty, isTouched: true },
            }));
        };

        // Validate with onBlurSchema (or schema fallback) and remove focus
        const onBlur = () => {
            const onBlurSchema = config[fieldName].onBlurSchema || config[fieldName].schema;
            const result = onBlurSchema.safeParse(value);

            setErrors((prev) => ({
                ...prev,
                [fieldName]: result.success ? [] : result.error.issues.map((i) => i.message),
            }));
            setStatus((prev) => ({
                ...prev,
                [fieldName]: { ...prev[fieldName], isValid: result.success, isFocus: false, isTouched: true },
            }));
        };

        const fieldErrors = errors[fieldName];
        const fieldStatus = status[fieldName];

        return { name, value, onChange, onBlur, onFocus, errors: fieldErrors, status: fieldStatus };
    }) as UseFormReturn<T>["register"];

    /**
     * Validates all fields with the strict schema.
     * Returns validated values if all fields pass, undefined otherwise.
     * Marks all fields as touched to display errors on submit.
     */
    const submit = () => {
        const parsedValues = fieldsNames.map((fieldName) => config[fieldName].schema.safeParse(values[fieldName]));

        const everyFieldsValid = parsedValues.every((result) => result.success);

        if (!everyFieldsValid) {
            const errorsArrayValues = parsedValues.map((result, index) => {
                if (!result.success) {
                    return [fieldsNames[index], result.error.issues.map((i) => i.message)];
                }
                return [fieldsNames[index], []];
            });

            const fieldErrors = Object.fromEntries(errorsArrayValues) as FieldObject<T, string[]>;
            setErrors(fieldErrors);

            // Mark all fields as touched and sync isValid per field
            setStatus((prev) => {
                const newStatus = { ...prev };
                fieldsNames.forEach((fieldName, index) => {
                    newStatus[fieldName] = {
                        ...newStatus[fieldName],
                        isTouched: true,
                        isValid: parsedValues[index].success,
                    };
                });
                return newStatus;
            });

            return undefined;
        }

        const fieldArrayValues = parsedValues.map((result, index) => [fieldsNames[index], result.data]);

        return Object.fromEntries(fieldArrayValues) as ValidatedValues<T>;
    };

    /** Resets all values, errors and status to their default state. */
    const reset = () => {
        setValues(defaultValues);
        setErrors(defaultErrors);
        setStatus(defaultStatus);
    };

    return { register, submit, reset };
};
