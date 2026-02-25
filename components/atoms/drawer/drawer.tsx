"use client";

import { Backdrop, Close, Description, DrawerProps, Popup, Portal, Root, Title, Trigger, Viewport } from "./atoms";

export default function Drawer(props: DrawerProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>Open drawer</Trigger>
            <Portal>
                <Backdrop />
                <Viewport>
                    <Popup>
                        <Title>Drawer</Title>
                        <Description>This is a drawer that slides in from the right.</Description>
                        <div className="flex justify-end gap-4">
                            <Close>Close</Close>
                        </div>
                    </Popup>
                </Viewport>
            </Portal>
        </Root>
    );
}
