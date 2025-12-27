"use client";

import Menu from "@comps/atoms/menu/menu";
import useTheme from "@core/theme/useTheme";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";
import { Button, Popup, Portal, Positioner, Trigger } from "../atoms/menu/atoms";

export default function MenuTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <Menu>
            <Trigger className="px-2">
                {theme === "system" && <SunMoon className="size-6" />}
                {theme === "dark" && <Moon className="size-6" />}
                {theme === "light" && <Sun className="size-6" />}
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <Button value="light" onItemClick={() => setTheme("light")}>
                            <Sun className="size-4" />
                            <span>Light</span>
                        </Button>
                        <Button value="dark" onItemClick={() => setTheme("dark")}>
                            <Moon className="size-4" />
                            <span>Dark</span>
                        </Button>
                        <Button value="system" onItemClick={() => setTheme("system")}>
                            <Monitor className="size-4" />
                            <span>System</span>
                        </Button>
                    </Popup>
                </Positioner>
            </Portal>
        </Menu>
    );
}
