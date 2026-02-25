"use client";

import { Backdrop, Close, Description, DialogProps, Popup, Portal, Root, Title, Trigger } from "./atoms";

export default function Dialog(props: DialogProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>View notifications</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Notifications</Title>
                    <Description>You are all caught up. Good job!</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Close</Close>
                    </div>
                </Popup>
            </Portal>
        </Root>
    );
}
