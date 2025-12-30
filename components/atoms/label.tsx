import cn from "@lib/cn";
import { ReactNode } from "react";

type LabelProps = {
    children: ReactNode;
    htmlFor?: string;
    className?: string;
};

export default function Label(props: LabelProps) {
    const { children, htmlFor, className } = props;

    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className,
            )}
        >
            {children}
        </label>
    );
}
