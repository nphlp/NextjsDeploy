"use client";

import { AlertDialogProps, Backdrop, Close, Description, Popup, Portal, Root, Title, Trigger } from "./atoms";

export default function AlertDialog(props: AlertDialogProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>Discard draft</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Discard draft?</Title>
                    <Description>You can&apos;t undo this action.</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Cancel</Close>
                        <Close className="text-destructive">Discard</Close>
                    </div>
                </Popup>
            </Portal>
        </Root>
    );
}
