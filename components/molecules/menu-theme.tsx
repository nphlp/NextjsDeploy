"use client";

import Menu from "@comps/atoms/menu/menu";
import useTheme from "@core/theme/useTheme";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";
import { ButtonItem, Popup, Portal, Positioner, Trigger } from "../atoms/menu/atoms";

export default function MenuTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <Menu>
            <Trigger className="border-none bg-transparent px-2 hover:bg-gray-100">
                {theme === "system" && <SunMoon className="size-6" />}
                {theme === "dark" && <Moon className="size-6" />}
                {theme === "light" && <Sun className="size-6" />}
            </Trigger>
            <Portal>
                <Positioner align="end">
                    <Popup>
                        <ButtonItem value="light" onItemClick={() => setTheme("light")}>
                            <Sun className="size-4" />
                            <span>Light</span>
                        </ButtonItem>
                        <ButtonItem value="dark" onItemClick={() => setTheme("dark")}>
                            <Moon className="size-4" />
                            <span>Dark</span>
                        </ButtonItem>
                        <ButtonItem value="system" onItemClick={() => setTheme("system")}>
                            <Monitor className="size-4" />
                            <span>System</span>
                        </ButtonItem>
                    </Popup>
                </Positioner>
            </Portal>
        </Menu>
    );
}
