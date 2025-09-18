"use client";

import { ChangeEvent, useState } from "react";
import { combo } from "@/lib/combo";

export default function Name() {
    const [name, setName] = useState("dev");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <h1 className="space-x-2 text-2xl font-bold">
            <span>Hello</span>
            <input
                type="text"
                name="name"
                autoComplete="name"
                className={combo(
                    "field-sizing-content w-fit border",
                    "focus:px-1 focus:outline-none",
                    // Rounded corners
                    "rounded-t-md focus:rounded-b-md",
                    // Borders
                    "border-x-transparent border-t-transparent border-b-black",
                    "focus:border-gray-500",
                    // Transitions
                    "transition-all duration-200",
                )}
                onChange={handleChange}
                value={name}
            />
            <span className="absolute translate-x-1">{name === "Clara" ? "❤️" : "👋"}</span>
        </h1>
    );
}
