"use client";

import { cn } from "@shadcn/lib/utils";
import { startsWith } from "lodash";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type MainProps = {
    offsetHeader: number;
    className?: string;
    children: ReactNode;
};

export default function Main(props: MainProps) {
    const { offsetHeader, className, children } = props;

    const path = usePathname();

    if (startsWith(path, "/dashboard")) return children;

    return (
        <main
            style={{ minHeight: `calc(100vh - ${offsetHeader}rem)` }}
            className={cn("flex flex-col items-center justify-center", className)}
        >
            {children}
        </main>
    );
}
