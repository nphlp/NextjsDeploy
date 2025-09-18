"use client";

import { combo } from "@/lib/combo";
import { ChangeEvent, useState } from "react";

export default function Name() {
    const [name, setName] = useState("dev");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <h1 className="text-2xl font-bold space-x-2">
            <span>Hello</span>
            <input
                type="text"
                name="name"
                autoComplete="name"
                className={combo(
                    "border w-fit field-sizing-content",
                    "focus:px-1 focus:outline-none",
                    // Rounded corners
                    "rounded-t-md focus:rounded-b-md",
                    // Borders
                    "border-b-black border-x-transparent border-t-transparent",
                    "focus:border-gray-500",
                    // Transitions
                    "transition-all duration-200",
                )}
                onChange={handleChange}
                value={name}
            />
            <span className="absolute translate-x-1">{name === "Clara" ? "❤️":"👋"}</span>
        </h1>
    );
}
