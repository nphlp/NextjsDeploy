"use client";

import { DEBUG_LAYOUT } from "@core/config";
import { useState } from "react";
import cn from "@/lib/cn";
import Toggle from "./toggle";

export default function Content() {
    const [isOpen, setIsOpen] = useState(false);

    const lorem =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const content = isOpen ? lorem.repeat(10) : lorem;

    return (
        <div className={cn("space-y-4", DEBUG_LAYOUT && "bg-purple-100")}>
            <Toggle isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="w-100 rounded border border-gray-300 p-4">{content}</div>
        </div>
    );
}
