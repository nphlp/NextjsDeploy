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
                className={{ button: "p-2" }}
                onClick={toggleTheme}
                focusVisible
            >
                {theme === "system" && <SunMoon className="size-6" />}
                {theme === "dark" && <Moon className="size-6" />}
                {theme === "light" && <Sun className="size-6" />}
            </Button>
        </div>
    );
}
