"use client";

import useTheme from "@comps/CORE/theme/useTheme";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shadcn/ui/dropdown-menu";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";

export default function ThemeDropdown() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-high hover:text-gray-high hover:bg-gray-light rounded-middle cursor-pointer p-2">
                {theme === "system" && <SunMoon className="size-6" />}
                {theme === "dark" && <Moon className="size-6" />}
                {theme === "light" && <Sun className="size-6" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[140px]">
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
