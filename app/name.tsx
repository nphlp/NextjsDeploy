"use client";

import { combo } from "@/lib/combo";
import { ChangeEvent, useState } from "react";

export default function Name() {
    const [name, setName] = useState("dev");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <h1 className="text-2xl font-bold">
            <span>Hello </span>
            <input
                className={combo(
                    "w-fit field-sizing-content",
                    "px-1 focus:outline-none",
                    // Rounded corners
                    "rounded-t-md focus:rounded-b-md",
                    // Borders
                    "border-b-black",
                    "border-x-transparent border-t-transparent",
                    "focus:border-x-black focus:border-t-black",
                    // Transitions
                    "transition-all duration-200",
                )}
                onChange={handleChange}
                value={name}
            />
            <span> 👋</span>
        </h1>
    );
}
