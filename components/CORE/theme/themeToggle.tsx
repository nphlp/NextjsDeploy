"use client";

import Button from "@comps/UI/button/button";
import { Moon, Sun, SunMoon } from "lucide-react";
import useTheme from "./useTheme";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex gap-2">
            <Button
                label="toggle-mode"
                variant="ghost"
                className={{ button: "p-1.5" }}
                onClick={toggleTheme}
                focusVisible
            >
                {theme === "system" && <SunMoon />}
                {theme === "dark" && <Moon />}
                {theme === "light" && <Sun />}
            </Button>
        </div>
    );
}
