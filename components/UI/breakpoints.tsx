"use client";

import { combo } from "@lib/combo";
import { useEffect, useRef, useState } from "react";

const env = process.env.NODE_ENV;
if (!env) throw new Error("NODE_ENV environment variable is not defined");

const rem = 16; // 1rem = 16px

const breakpoints = [
    { name: "mobile", value: 0 },

    { name: "3xs", value: 20 * rem }, // 320px
    { name: "2xs", value: 26 * rem }, // 416px
    { name: "xs", value: 32 * rem }, // 512px
    { name: "sm", value: 40 * rem }, // 640px
    { name: "md", value: 48 * rem }, // 768px
    { name: "lg", value: 64 * rem }, // 1024px
    { name: "xl", value: 80 * rem }, // 1280px
    { name: "2xl", value: 96 * rem }, // 1536px
    { name: "3xl", value: 120 * rem }, // 1920px

    { name: "ultra-wide", value: 2000 * rem },
];

type BreakpointsProps = {
    mode?: "alwaysOn" | "onResize" | "off";
    timeToDesappear?: number;
};

export default function Breakpoints(props: BreakpointsProps) {
    const { mode = "onResize", timeToDesappear = 2000 } = props;

    const previousWidth = useRef<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    // Handle visibility timeout
    useEffect(() => {
        if (previousWidth.current === width) return;

        const timeout = setTimeout(() => {
            if (mode === "onResize") setIsVisible(false);
        }, timeToDesappear);

        return () => clearTimeout(timeout);
    }, [width, isVisible, mode, timeToDesappear]);

    // Listen to window resize
    useEffect(() => {
        const handleResize = () => {
            // Save previous width
            previousWidth.current = width;

            // Update current width
            setWidth(window.innerWidth);
            setIsVisible(true);
        };

        // First render
        if (width === 0) handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    // Find current breakpoint
    const indexOffset = breakpoints.findIndex((bp) => bp.value >= width) - 1;
    const index = indexOffset >= 0 ? indexOffset : 0;

    // Get current and next breakpoints
    const current = breakpoints[index];
    const next = breakpoints[index + 1];
    const last = breakpoints[breakpoints.length - 1];

    // Calculate offset
    const currentOffset = width - current.value;
    const nextOffset = next.value - width;

    if (mode === "off" || env !== "development") return null;

    return (
        <div
            className={combo(
                "fixed right-2 bottom-2",
                isVisible ? "opacity-100" : "opacity-0",
                "transition-opacity duration-500",
            )}
        >
            <div className="flex justify-end gap-2 text-sm">
                <div className="text-gray-middle">{`${currentOffset} < `}</div>
                <div className="font-bold">
                    <span>{width}</span>
                    <span>px</span>
                </div>
                <div className="text-gray-middle">{` < ${nextOffset}`}</div>
            </div>

            <div className="flex justify-end gap-2 uppercase">
                {index !== 0 && <div className="text-gray-middle">{`${current.value} < `}</div>}

                <div className="font-bold">{current.name}</div>

                <div className="text-gray-middle">
                    {index !== breakpoints.length - 2 ? ` < ${next.value}` : ` < ${last.name}`}
                </div>
            </div>
        </div>
    );
}
