"use client";

import { type ReactNode } from "react";
import { UseFormProps, UseFormReturn } from "../use-form";
import { FormContext } from "./context";

type FormProviderProps<T extends UseFormProps> = {
    register: UseFormReturn<T>["register"];
    children: ReactNode;
};

export function FormProvider<T extends UseFormProps>(props: FormProviderProps<T>) {
    const { register, children } = props;

    return <FormContext.Provider value={register}>{children}</FormContext.Provider>;
}
