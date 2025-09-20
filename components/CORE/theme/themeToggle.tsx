"use client";

import Button from "@comps/UI/button/button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useContext } from "react";
import { Context } from "./themeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useContext(Context);

    return (
        <div className="flex gap-2">
            <Button
                label="toggle-mode"
                variant="outline"
                className={{ button: "text-foreground hover:bg-gray-low border-gray-low bg-background p-1.5" }}
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
