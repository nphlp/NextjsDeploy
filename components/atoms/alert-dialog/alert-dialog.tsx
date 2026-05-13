"use client";

import {
    AlertDialogProps,
    Backdrop,
    Close,
    Description,
    Footer,
    Header,
    Popup,
    Portal,
    Root,
    Title,
    Trigger,
} from "./atoms";

/**
 * Demo: short AlertDialog with Header + Footer only — `<Content>` is
 * skipped on mini confirmations (single question + Cancel/Confirm) to
 * avoid the empty `flex-1` region between the two sticky bars. See
 * `AlertDialogLongContent` for the full triplet with a scrollable body
 * (e.g. Terms of Service excerpt before a destructive confirm).
 */
export default function AlertDialog(props: AlertDialogProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger colors="destructive">Discard draft</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Header>
                        <Title>Discard draft?</Title>
                        <Description>You can&apos;t undo this action.</Description>
                    </Header>
                    <Footer>
                        <Close>Cancel</Close>
                        <Close colors="destructive">Discard</Close>
                    </Footer>
                </Popup>
            </Portal>
        </Root>
    );
}
