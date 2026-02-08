import { Form as FormBaseUi } from "@base-ui/react/form";
import cn from "@lib/cn";
import { ComponentProps, FormHTMLAttributes, ReactNode } from "react";

type LegacyProps = FormHTMLAttributes<HTMLFormElement>;

export type FormProps = {
    className?: string;
    children?: ReactNode;
    legacyProps?: LegacyProps;
} & Omit<ComponentProps<typeof FormBaseUi>, keyof LegacyProps>;

export default function Form(props: FormProps) {
    const { className, children, legacyProps, ...othersProps } = props;

    return (
        <FormBaseUi className={cn("flex w-full flex-col gap-3", className)} {...othersProps} {...legacyProps}>
            {children}
        </FormBaseUi>
    );
}
