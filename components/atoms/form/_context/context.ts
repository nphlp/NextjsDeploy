import { createContext } from "react";
import { UseFormProps, UseFormReturn } from "../use-form";

export type FormContextType<T extends UseFormProps> = UseFormReturn<T>["register"];

export const FormContext = (<T extends UseFormProps>() =>
    createContext<FormContextType<T>>({} as FormContextType<T>))();
