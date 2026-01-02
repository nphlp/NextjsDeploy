import cn from "@lib/cn";
import { ReactNode } from "react";

type CardProps = {
    className?: string;
    children?: ReactNode;
};

export default function Card(props: CardProps) {
    const { className, children } = props;

    return (
        <div
            className={cn(
                "flex w-full flex-col gap-3",
                "rounded-lg border border-gray-200",
                "p-6",
                "shadow-sm",
                className,
            )}
        >
            {children}
        </div>
    );
}
