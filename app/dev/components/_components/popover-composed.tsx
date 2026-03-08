"use client";

import Popover, { Arrow, Description, Popup, Portal, Positioner, Title, Trigger } from "@atoms/popover";
import { Bell } from "lucide-react";

export default function PopoverComposed() {
    return (
        <Popover>
            <Trigger>
                <Bell className="size-5" aria-label="Notifications" />
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <Arrow />
                        <Title>Custom Popover</Title>
                        <Description>This is a composed popover with custom content.</Description>
                    </Popup>
                </Positioner>
            </Portal>
        </Popover>
    );
}
