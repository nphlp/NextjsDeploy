"use client";

import {
    Backdrop,
    Close,
    Description,
    DialogProps,
    Footer,
    Header,
    Popup,
    Portal,
    Root,
    Title,
    Trigger,
} from "./atoms";

/**
 * Demo: short Dialog with Header + Footer only — `<Content>` is skipped on
 * mini dialogs (single message + actions) to avoid the empty `flex-1`
 * region between the two sticky bars. See `DialogLongContent` for the
 * full triplet with a scrollable Content.
 */
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
                    <Header>
                        <Title>Notifications</Title>
                        <Description>You are all caught up. Good job!</Description>
                    </Header>
                    <Footer>
                        <Close>Close</Close>
                    </Footer>
                </Popup>
            </Portal>
        </Root>
    );
}
