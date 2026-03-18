"use client";

import {
    ContextMenuProps,
    Item,
    Popup,
    Portal,
    Positioner,
    Root,
    Separator,
    SubmenuRoot,
    SubmenuTrigger,
    Trigger,
} from "./atoms";

export default function ContextMenu(props: ContextMenuProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>Right click here</Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <Item>Add to Library</Item>

                        <SubmenuRoot>
                            <SubmenuTrigger>Add to Playlist</SubmenuTrigger>
                            <Portal>
                                <Positioner alignOffset={-4} sideOffset={-4}>
                                    <Popup>
                                        <Item>Favorites</Item>
                                        <Item>Recently Played</Item>
                                        <Separator />
                                        <Item>New playlist…</Item>
                                    </Popup>
                                </Positioner>
                            </Portal>
                        </SubmenuRoot>

                        <Separator />
                        <Item>Play Next</Item>
                        <Item>Play Last</Item>
                        <Separator />
                        <Item>Favorite</Item>
                        <Item>Share</Item>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
