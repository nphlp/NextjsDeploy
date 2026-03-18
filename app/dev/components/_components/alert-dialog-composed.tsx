"use client";

import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title, Trigger } from "@atoms/alert-dialog";

export default function AlertDialogComposed() {
    return (
        <AlertDialog>
            <Trigger colors="destructive">Delete account</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Delete account?</Title>
                    <Description>All your data will be permanently removed.</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Cancel</Close>
                        <Close colors="destructive">Delete</Close>
                    </div>
                </Popup>
            </Portal>
        </AlertDialog>
    );
}
