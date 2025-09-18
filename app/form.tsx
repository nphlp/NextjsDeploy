"use client";

import { combo } from "@/lib/combo";
import { ChangeEvent, useState } from "react";

export default function Form() {
    const [name, setName] = useState("dev");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <h1 className="text-2xl font-bold">
            <span>Hello </span>
            <input
                className={combo(
                    "px-1 field-sizing-content border focus:outline-none",
                    "rounded-t-md focus:rounded-b-md",
                    "border-x-transparent border-t-transparent border-b-black",
                    "focus:border-x-black focus:border-t-black",
                    "transition-all duration-200",
                )}
                onChange={handleChange}
                value={name}
            />
            <span> 👋</span>
        </h1>
    );
}
