"use client";

import { Bell } from "lucide-react";
import { Arrow, Close, Description, PopoverProps, Popup, Portal, Positioner, Root, Title, Trigger } from "./atoms";

export default function Popover(props: PopoverProps) {
    const { children, ...otherProps } = props;

    // Composable usage
    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    // Composable demo
    return (
        <Root {...otherProps}>
            <Trigger>
                <Bell className="size-5" aria-label="Notifications" />
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <Arrow />
                        <Title>Notifications</Title>
                        <Description>You are all caught up. Good job!</Description>
                        <div className="mt-4 flex justify-end">
                            <Close>Close</Close>
                        </div>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
