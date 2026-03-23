"use client";

import { useState } from "react";
import { ZodType } from "zod";

type FieldConfig<V, S extends V = V> = {
    /**
     * Zod Schema
     * - for submit validation
     * - infer type for validated value
     * - also for onChange validation (if no override schema provided)
     * - also for onBlur validation (if no override schema provided)
     */
    schema: ZodType<S>;
    /**
     * Override schema
     * - for onChange validation
     * - useful to prevent showing errors until the user has finished typing (e.g. email field in `/register` page)
     */
    onChangeSchema?: ZodType;
    /**
     * Override schema
     * - for blur validation
     * - useful to prevent showing errors if the user juste click in and out the field without filling it (e.g. firstname field in `/profile` page)
     */
    onBlurSchema?: ZodType;
    /**
     * Setter function to store the field state
     * - infer type for field controller state
     * -> e.g. `setter: (value: number) => value.toString()`
     * -> e.g. `setter: (value: string | null) => value`
     */
    setter: (value: V) => V;
    /**
     * Initial value for the field
     * -> `defaultValue: ""` for a text input
     * -> `defaultValue: null` for a select
     * -> `defaultValue: []` for a multi-select, etc.
     */
    defaultValue: V;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseFormProps = Record<string, FieldConfig<any, any>>;

type FieldName<T extends UseFormProps> = keyof T & string;
type FieldValue<F> = F extends FieldConfig<infer V> ? V : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaValue<F> = F extends FieldConfig<any, infer S> ? S : never;

type FieldMap<T extends UseFormProps, U> = {
    [K in FieldName<T>]: U;
};

export type FieldStatus = {
    /** Field passes its schema validation */
    isValid: boolean;
    /** Field value is empty ("", null, undefined, [], {}) */
    isEmpty: boolean;
    /** Field is currently focused */
    isFocus: boolean;
    /** Field has been interacted with at least once */
    isTouched: boolean;
};

export type States<T extends UseFormProps> = { [K in FieldName<T>]: FieldValue<T[K]> };

type SetStates<T extends UseFormProps> = {
    [K in FieldName<T>]: (value: FieldValue<T[K]>) => void;
};

type ValidatedValues<T extends UseFormProps> = { [K in FieldName<T>]: SchemaValue<T[K]> };

export type UseFormReturn<T extends UseFormProps> = {
    /**
     * Bind a field by name
     * -> returns value, status, errors
     * -> onFocus, onChange and onBlur handlers
     */
    register: <K extends FieldName<T>>(
        fieldName: K,
    ) => {
        name: K;
        value: FieldValue<T[K]>;
        status: FieldStatus;
        errors: string[];
        onFocus: () => void;
        onBlur: () => void;
        onChange: (value: FieldValue<T[K]>) => void;
    };
    /** Current values for all fields */
    states: States<T>;
    /** Set a field value programmatically */
    setStates: SetStates<T>;
    /** Validate all fields, returns validated data or undefined on failure */
    submit: () => ValidatedValues<T> | undefined;
    /** Reset all fields to their default values */
    reset: () => void;
};

/**
 * Make a key-array form object keys
 * Input -> { name: "John", lastname: "Doe", age: 30 }
 * Output -> ["name", "lastname", "age"]
 */
const extractKeysFromObject = <T extends UseFormProps>(obj: T) => Object.keys(obj) as FieldName<T>[];

/**
 * Make a key-value-array from object
 * Input -> { name: "John", lastname: "Doe", age: 30 }
 * Output -> [["name", "John"], ["lastname", "Doe"], ["age", 30]]
 */
const extractEntriesFromObject = <T extends UseFormProps>(obj: T) =>
    Object.entries(obj) as [FieldName<T>, T[FieldName<T>]][];

/**
 * Make an object from key-value-array
 * Input -> [["name", "John"], ["lastname", "Doe"], ["age", 30]]
 * Output -> { name: "John", lastname: "Doe", age: 30 }
 */
const buildObjectFromEntries = <T extends UseFormProps, R>(entries: [FieldName<T>, R][]) =>
    Object.fromEntries(entries) as FieldMap<T, R>;

/**
 * Map on key-value-array from keys to transform values
 * Input -> [["name", "John"], ["lastname", "Doe"], ["age", 30]]
 * Map -> ([key, value]) => [key, value.toString().toUpperCase()]
 * Output -> [["name", "JOHN"], ["lastname", "DOE"], ["age", "30"]]
 */
const mapEntries = <T extends UseFormProps, V, R>(
    entries: [FieldName<T>, V][],
    fn: (entry: [FieldName<T>, V]) => [FieldName<T>, R],
) => entries.map(fn);

/**
 * Map on object through a key-value-array
 * Input -> { name: "John", lastname: "Doe", age: 30 }
 * Map -> ([key, value]) => [key, value.toString().toUpperCase()]
 * Output -> { name: "JOHN", lastname: "DOE", age: "30" }
 */
const mapObjectEntries = <T extends UseFormProps, R>(
    obj: T,
    fn: (entry: [FieldName<T>, T[FieldName<T>]]) => [FieldName<T>, R],
) => buildObjectFromEntries<T, R>(mapEntries(extractEntriesFromObject(obj), fn));

/**
 * Default status for each field
 * -> not valid, empty, not focused, not touched
 */
const initialStatus: FieldStatus = { isValid: false, isEmpty: true, isFocus: false, isTouched: false };

/**
 * Validate a value with a schema
 */
const validate = <S>(schema: ZodType<S>, value: unknown) => {
    const result = schema.safeParse(value);
    const fieldErrors = result.success ? [] : result.error.issues.map((i) => i.message);
    const isValid = fieldErrors.length === 0;
    return { fieldErrors, isValid, data: result.data };
};

/**
 * State updater — replace a field value
 * Usage -> setState(setField(key, value))
 */
const setField =
    <K extends string, V>(key: K, value: V) =>
    <S extends Record<K, V>>(prev: S) => ({ ...prev, [key]: value });

/**
 * State updater — merge into a field value
 * Usage -> setState(mergeField(key, { isValid: true }))
 */
const mergeField =
    <K extends string, V extends object>(key: K, partial: Partial<V>) =>
    <S extends Record<K, V>>(prev: S) => ({ ...prev, [key]: { ...prev[key], ...partial } });

/**
 * Check if value has empty state
 */
const isValueEmpty = (value: unknown) =>
    value === "" ||
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0);

/**
 * Form hook for client-side validation and indications
 * See more details and example in `app/form/_components/form-example.tsx`
 */
export const useForm = <T extends UseFormProps>(config: T): UseFormReturn<T> => {
    const fields = extractKeysFromObject(config);

    const defaultValues = mapObjectEntries(config, ([f]) => [f, config[f].defaultValue]);
    const defaultErrors = mapObjectEntries(config, ([f]) => [f, []]);
    const defaultStatus = mapObjectEntries(config, ([f]) => [f, initialStatus]);

    const [values, setValues] = useState<States<T>>(defaultValues);
    const [errors, setErrors] = useState<FieldMap<T, string[]>>(defaultErrors);
    const [status, setStatus] = useState<FieldMap<T, FieldStatus>>(defaultStatus);

    const register = <K extends FieldName<T>>(fieldName: K) => {
        const onFocus = () => {
            setStatus(mergeField(fieldName, { isFocus: true, isTouched: true }));
        };

        const onChange = (newValue: FieldValue<T[K]>) => {
            // Transform & store
            const transformed = config[fieldName].setter(newValue);
            setValues(setField(fieldName, transformed));

            // Validate (progressive schema if available)
            const isEmpty = isValueEmpty(transformed);
            const schema = config[fieldName].onChangeSchema || config[fieldName].schema;
            const { fieldErrors, isValid } = validate(schema, transformed);

            // Update errors & status
            setErrors(setField(fieldName, fieldErrors));
            setStatus(mergeField(fieldName, { isValid, isEmpty, isTouched: true }));
        };

        const onBlur = () => {
            // Validate (strict schema if available)
            const schema = config[fieldName].onBlurSchema || config[fieldName].schema;
            const { fieldErrors, isValid } = validate(schema, values[fieldName]);

            // Update errors & status
            setErrors(setField(fieldName, fieldErrors));
            setStatus(mergeField(fieldName, { isValid, isFocus: false, isTouched: true }));
        };

        return {
            name: fieldName,
            value: values[fieldName],
            errors: errors[fieldName],
            status: status[fieldName],
            onChange,
            onBlur,
            onFocus,
        };
    };

    const submit = () => {
        // Validate all fields with primary schema
        const resultMap = mapObjectEntries(config, ([f]) => [f, validate(config[f].schema, values[f])]);
        const everyValid = fields.every((f) => resultMap[f].isValid);

        // Success — return validated data
        if (everyValid) {
            return mapObjectEntries(config, ([f]) => [f, resultMap[f].data]);
        }

        // Failure — surface errors & mark fields as touched
        setErrors(mapObjectEntries(config, ([f]) => [f, resultMap[f].fieldErrors]));
        setStatus((prev) =>
            mapObjectEntries(config, ([f]) => [f, { ...prev[f], isTouched: true, isValid: resultMap[f].isValid }]),
        );
    };

    const setStates = mapObjectEntries(config, ([f]) => [
        f,
        (newValue: FieldValue<T[typeof f]>) => register(f).onChange(newValue),
    ]);

    const reset = () => {
        setValues(defaultValues);
        setErrors(defaultErrors);
        setStatus(defaultStatus);
    };

    return { register, states: values, setStates, submit, reset };
};
