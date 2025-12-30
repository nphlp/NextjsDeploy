import cn from "@lib/cn";
import { ReactNode } from "react";

type CardProps = {
    className?: string;
    children?: ReactNode;
};

export function Card(props: CardProps) {
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

type CardContentProps = {
    className?: string;
    children?: ReactNode;
};

export function CardContent(props: CardContentProps) {
    const { className, children } = props;

    return <div className={cn("p-0", className)}>{children}</div>;
}

export default Card;
