"use client";

import Button from "@atoms/button";
import cn from "@lib/cn";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Root, type RootProps } from "./atoms";

type InputPasswordProps = Omit<RootProps, "type" | "render">;

export default function InputPassword(props: InputPasswordProps) {
    const { className, ...othersProps } = props;

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <Root
                type={showPassword ? "text" : "password"}
                className={cn("h-10 focus:-outline-offset-1", className)}
                {...othersProps}
            />
            <Button
                label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 px-3 py-3 text-gray-600"
                noStyle
            >
                {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
            </Button>
        </div>
    );
}

export const InputPasswordSkeleton = () => {
    return (
        <div className="relative w-full">
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
                <div className="h-5 w-34 flex-none rounded bg-gray-100"></div>
                <div className="absolute top-1/2 right-3 size-5 flex-none -translate-y-1/2 rounded bg-gray-100"></div>
            </div>
        </div>
    );
};
