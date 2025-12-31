import cn from "@lib/cn";
import { ReactNode } from "react";
import { HEADER_HEIGHT } from "./config";

type MainProps = {
    className?: string;
    children: ReactNode;
};

export default function Main(props: MainProps) {
    const { className, children } = props;

    return (
        <main
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}rem)` }}
            className={cn("flex flex-col items-center justify-center gap-4", "mx-auto max-w-225 p-4 md:p-7", className)}
        >
            {children}
        </main>
    );
}
