import { Form as FormBaseUi, FormProps } from "@base-ui/react/form";
import cn from "@lib/cn";
import { ReactNode } from "react";

type InputProps = {
    className?: string;
    children?: ReactNode;
} & FormProps;

export default function Form(props: InputProps) {
    const { className, children, ...othersProps } = props;

    return (
        <FormBaseUi className={cn("flex w-full flex-col gap-3", className)} {...othersProps}>
            {children}
        </FormBaseUi>
    );
}
