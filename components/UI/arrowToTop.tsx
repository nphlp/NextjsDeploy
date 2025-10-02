"use client";

import { combo } from "@lib/combo";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "./button/button";

const env = process.env.NODE_ENV;
if (!env) throw new Error("NODE_ENV environment variable is not defined");

type BreakpointsProps = {
    timeToDesappear?: number;
};

export default function ArrowToTop(props: BreakpointsProps) {
    const { timeToDesappear = 2000 } = props;

    const previousPostition = useRef<number>(0);
    const [postion, setPostition] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    // Handle visibility timeout
    useEffect(() => {
        if (previousPostition.current === postion) return;

        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, timeToDesappear);

        return () => clearTimeout(timeout);
    }, [postion, isVisible, timeToDesappear]);

    // Listen to window resize
    useEffect(() => {
        const mainId = document.getElementById("main");
        if (!mainId) return;

        const handleResize = () => {
            // Save previous postion
            previousPostition.current = postion;

            // Update current postion
            setPostition(mainId.scrollTop);
            setIsVisible(true);
        };

        // First render
        if (postion === 0) handleResize();

        // Add event listener
        mainId.addEventListener("scroll", handleResize);

        // Clean up
        return () => mainId.removeEventListener("scroll", handleResize);
    }, [postion]);

    const handleClick = () => {
        const mainId = document.getElementById("main");
        if (mainId) mainId.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (env === "development") return null;

    return (
        <Button
            label="Scroll to top"
            variant="outline"
            className={{
                button: combo(
                    "fixed right-4 bottom-4 rounded-full p-1",
                    postion !== 0 && isVisible ? "opacity-100" : "pointer-events-none opacity-0",
                    "transition-opacity duration-500",
                ),
            }}
            onClick={handleClick}
        >
            <ArrowUp className="size-6" />
        </Button>
    );
}
