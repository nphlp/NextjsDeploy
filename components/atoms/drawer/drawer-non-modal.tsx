"use client";

import {
    Close,
    Content,
    Description,
    DrawerProps,
    NonModalPopup,
    NonModalViewport,
    Portal,
    Root,
    Title,
    Trigger,
} from "./atoms";

export default function DrawerNonModal(props: DrawerProps) {
    const { children, ...otherProps } = props;

    // Composable usage
    if (children) {
        return (
            <Root disablePointerDismissal {...otherProps} modal={false}>
                {children}
            </Root>
        );
    }

    // Composable demo
    return (
        <Root swipeDirection="right" disablePointerDismissal {...otherProps} modal={false}>
            <Trigger>Open non-modal drawer</Trigger>
            <Portal>
                <NonModalViewport>
                    <NonModalPopup>
                        <Content>
                            <Title>Non-modal drawer</Title>
                            <Description>
                                This drawer does not trap focus and ignores outside clicks. Use the close button or
                                swipe to dismiss it.
                            </Description>
                            <div className="flex justify-end gap-4">
                                <Close>Close</Close>
                            </div>
                        </Content>
                    </NonModalPopup>
                </NonModalViewport>
            </Portal>
        </Root>
    );
}
