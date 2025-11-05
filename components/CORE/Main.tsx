import { cn } from "@shadcn/lib/utils";
import { ReactNode } from "react";

type MainProps = {
    offsetHeader: number;
    className?: string;
    children: ReactNode;
};

export default async function Main(props: MainProps) {
    const { offsetHeader, className, children } = props;

    return (
        <main
            style={{ minHeight: `calc(100vh - ${offsetHeader}rem)` }}
            className={cn("flex flex-col items-center justify-center", className)}
        >
            {children}
        </main>
    );
}
