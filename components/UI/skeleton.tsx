"use client";

import { combo } from "@lib/combo";
import { ReactNode } from "react";

type SkeletonContainerProps = {
    height?: string;
    width?: string;
    noShrink?: boolean;
    className?: string;
    children?: ReactNode;
};

export const SkeletonContainer = (props: SkeletonContainerProps) => {
    const { height, width, noShrink, className, children } = props;

    return (
        <div
            style={{ height, width }}
            className={combo(
                "animate-pulse",
                "w-full",
                "overflow-hidden",
                "px-4 py-1.5",
                "text-foreground bg-background",
                "border-gray-low rounded-lg border",
                noShrink && "shrink-0",
                className,
            )}
        >
            {children}
        </div>
    );
};

type FontSizeTailwind = "3xs" | "2xs" | "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

type SkeletonTextProps = {
    // Text based height
    fontSize?: FontSizeTailwind;
    topOffset?: number;
    bottomOffset?: number;

    // Absolute width
    width?: string;
    noShrink?: boolean;

    // Variable widths
    minWidth?: number;
    maxWidth?: number;
    index?: number;

    className?: string;
};

export const SkeletonText = (props: SkeletonTextProps) => {
    const {
        fontSize = "base",
        topOffset = 2,
        bottomOffset = 2,
        width,
        noShrink = false,
        minWidth = 70,
        maxWidth = 100,
        index = 0,
        className,
    } = props;

    const fontSizeClass = (fontSize: FontSizeTailwind) => {
        switch (fontSize) {
            case "3xs":
                return "text-3xs";
            case "2xs":
                return "text-2xs";
            case "xs":
                return "text-xs";
            case "sm":
                return "text-sm";
            case "base":
                return "text-base";
            case "lg":
                return "text-lg";
            case "xl":
                return "text-xl";
            case "2xl":
                return "text-2xl";
            case "3xl":
                return "text-3xl";
            case "4xl":
                return "text-4xl";
        }
    };

    const variableWidth = (min: number, max: number, index: number) => {
        // Pseudo-random to prevent SSR hydration issues
        const random = [0.8, 0.2, 0.95, 0.6, 0.3];
        const randomNumber = random[index % random.length];
        const widthInRange = Math.floor(randomNumber * (max - min + 1)) + min;
        return `${widthInRange}%`;
    };

    return (
        <div
            style={{ width: width ?? variableWidth(minWidth, maxWidth, index) }}
            className={combo("relative", noShrink && "shrink-0", fontSizeClass(fontSize), className)}
        >
            {/* Reduce height */}
            <span
                style={{ top: `${topOffset}px`, bottom: `${bottomOffset}px` }}
                className={combo("bg-gray-low absolute rounded", "w-full")}
            />

            {/* For real text reference */}
            <span>&nbsp;</span>
        </div>
    );
};
