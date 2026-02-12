"use client";

import cn from "@lib/cn";
import { Root, type RootProps } from "./atoms";

type InputProps = RootProps;

export default function Input(props: InputProps) {
    const { className, ...othersProps } = props;

    return <Root className={cn("h-10", className)} {...othersProps} />;
}

export const InputSkeleton = () => {
    return (
        <div
            className={cn(
                "animate-pulse",
                // Layout
                "h-10 w-full",
                // Border
                "rounded-md border border-gray-200",
                // Padding
                "px-3.5 py-2.25",
            )}
        >
            <div className="h-5 w-24 flex-none rounded bg-gray-100"></div>
        </div>
    );
};
