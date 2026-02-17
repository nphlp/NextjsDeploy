"use client";

import Drawer, { Backdrop, Close, Description, Popup, Portal, Title, Trigger, Viewport } from "@atoms/drawer";

export default function DrawerComposed() {
    return (
        <Drawer>
            <Trigger>Open settings</Trigger>
            <Portal>
                <Backdrop />
                <Viewport>
                    <Popup>
                        <Title>Settings</Title>
                        <Description>Adjust your preferences here.</Description>
                        <div className="flex justify-end gap-4">
                            <Close>Done</Close>
                        </div>
                    </Popup>
                </Viewport>
            </Portal>
        </Drawer>
    );
}
