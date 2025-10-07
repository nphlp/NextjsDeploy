"use client";

import useTheme from "@comps/CORE/theme/useTheme";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shadcn/ui/dropdown-menu";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";

export function DropdownMenuDemo() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-gray-light rounded-middle cursor-pointer p-2">
                {theme === "system" && <SunMoon className="size-6" />}
                {theme === "dark" && <Moon className="size-6" />}
                {theme === "light" && <Sun className="size-6" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[140px]" align="start">
                <DropdownMenuItem className="flex gap-4" onClick={() => setTheme("light")}>
                    <Sun className="size-5" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-4" onClick={() => setTheme("dark")}>
                    <Moon className="size-5" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-4" onClick={() => setTheme("system")}>
                    <Monitor className="size-5" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
