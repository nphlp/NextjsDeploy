"use client";

import Menu, { Arrow, Item, Popup, Portal, Positioner, Trigger } from "@atoms/menu";
import useTheme from "@core/theme/_context/use-theme";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";

export default function MenuTheme() {
    const { setTheme } = useTheme();

    return (
        <Menu>
            <Trigger className="border-none bg-transparent px-2 hover:bg-gray-100">
                <SunMoon className="size-6" data-theme-icon="system" />
                <Moon className="size-6" data-theme-icon="dark" />
                <Sun className="size-6" data-theme-icon="light" />
            </Trigger>
            <Portal>
                <Positioner align="end">
                    <Popup>
                        <Arrow />
                        <Item onClick={() => setTheme("light")}>
                            <Sun className="size-4" />
                            <span>Light</span>
                        </Item>
                        <Item onClick={() => setTheme("dark")}>
                            <Moon className="size-4" />
                            <span>Dark</span>
                        </Item>
                        <Item onClick={() => setTheme("system")}>
                            <Monitor className="size-4" />
                            <span>System</span>
                        </Item>
                    </Popup>
                </Positioner>
            </Portal>
        </Menu>
    );
}
