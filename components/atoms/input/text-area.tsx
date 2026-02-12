"use client";

import cn from "@lib/cn";
import { Root, type RootProps } from "./atoms";

type TextAreaProps = Omit<RootProps, "type" | "render">;

export default function TextArea(props: TextAreaProps) {
    const { className, ...othersProps } = props;

    return (
        <Root
            render={<textarea />}
            className={cn(
                // Text area specific
                "field-sizing-content resize-none",
                // Layout
                "min-h-16.5",
                // Text
                "leading-6",
                // Outline override
                "focus:-outline-offset-1",
                className,
            )}
            {...othersProps}
        />
    );
}

export const TextAreaSkeleton = () => {
    return (
        <div
            className={cn(
                "animate-pulse",
                // Layout
                "h-16.5 w-full",
                // Border
                "rounded-md border border-gray-200",
                // Padding
                "px-3.5 py-2.25",
            )}
        >
            <div className="h-5 w-32 flex-none rounded bg-gray-100"></div>
        </div>
    );
};
