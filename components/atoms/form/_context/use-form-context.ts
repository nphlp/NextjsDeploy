import { useContext } from "react";
import { UseFormProps } from "../use-form";
import { FormContext, FormContextType } from "./context";

export function useFormContext<T extends UseFormProps>(): FormContextType<T> {
    const context = useContext(FormContext);
    if (!context) throw new Error("useFromContext must be used within a <Form /> component");
    return context;
}
