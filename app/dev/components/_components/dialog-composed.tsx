"use client";

import Dialog, { Backdrop, Close, Description, Popup, Portal, Title, Trigger } from "@atoms/dialog";

export default function DialogComposed() {
    return (
        <Dialog>
            <Trigger>Edit profile</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Edit profile</Title>
                    <Description>Make changes to your profile here.</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Save</Close>
                    </div>
                </Popup>
            </Portal>
        </Dialog>
    );
}
