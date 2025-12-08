"use client";

import useTheme from "@comps/CORE/theme/useTheme";
import { cn } from "@comps/SHADCN/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shadcn/ui/dropdown-menu";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";

export default function ThemeDropdown() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-foreground hover:bg-accent hover:text-foreground cursor-pointer rounded-md p-2">
                {theme === "system" && <SunMoon className="size-6" />}
                {theme === "dark" && <Moon className="size-6" />}
                {theme === "light" && <Sun className="size-6" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[140px]">
                <DropdownMenuItem
                    className={cn(
                        "text-muted-foreground focus:text-muted-foreground flex gap-4",
                        theme === "light" &&
                            "[&>svg]:stroke-foreground text-foreground focus:text-foreground font-semibold",
                    )}
                    onClick={() => setTheme("light")}
                >
                    <Sun className="size-5" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={cn(
                        "text-muted-foreground focus:text-muted-foreground flex gap-4",
                        theme === "dark" &&
                            "[&>svg]:stroke-foreground text-foreground focus:text-foreground font-semibold",
                    )}
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="size-5" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={cn(
                        "text-muted-foreground focus:text-muted-foreground flex gap-4",
                        theme === "system" &&
                            "[&>svg]:stroke-foreground text-foreground focus:text-foreground font-semibold",
                    )}
                    onClick={() => setTheme("system")}
                >
                    <Monitor className="size-5" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
