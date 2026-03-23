import cn from "@lib/cn";
import { FormHTMLAttributes, ReactNode, SubmitEventHandler } from "react";
import { FormProvider } from "./_context/provider";
import { UseFormProps, UseFormReturn } from "./use-form";

export type OnSubmit = SubmitEventHandler<HTMLFormElement> | undefined;

export type FormProps<T extends UseFormProps> = {
    onSubmit: OnSubmit;
    register: UseFormReturn<T>["register"];
    className?: string;
    children?: ReactNode;
    legacyProps?: FormHTMLAttributes<HTMLFormElement>;
};

export default function Form<T extends UseFormProps>(props: FormProps<T>) {
    const { onSubmit, register, className, children, legacyProps, ...othersProps } = props;

    return (
        <form
            onSubmit={onSubmit}
            className={cn("flex w-full flex-col gap-3", className)}
            {...othersProps}
            {...legacyProps}
        >
            <FormProvider register={register}>{children}</FormProvider>
        </form>
    );
}
