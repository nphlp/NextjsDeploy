"use client";

import { ReactNode } from "react";
import {
    ButtonItem,
    CheckboxItem,
    Group,
    Popup,
    Portal,
    Positioner,
    RadioItem,
    RadioSet,
    Root,
    Separator,
    SubMenu,
    SubPopup,
    SubPortal,
    SubPositioner,
    SubTrigger,
    Trigger,
} from "./atoms";

type MenuProps = {
    children?: ReactNode;
};

export default function Menu(props: MenuProps) {
    const { children } = props;

    if (children) return <Root>{children}</Root>;

    return (
        <Root>
            <Trigger label="Menu" />
            <Portal>
                <Positioner>
                    <Popup>
                        <ButtonItem label="Play" value="play" />
                        <ButtonItem label="Pause" value="pause" />

                        <Separator />

                        <Group label="My lists">
                            <CheckboxItem label="Like" defaultChecked />
                            <CheckboxItem label="Favorite" />
                        </Group>

                        <Separator />

                        <Group label="Repeat mode">
                            <RadioSet defaultValue="disabled">
                                <RadioItem label="Disabled" value="disabled" />
                                <RadioItem label="Random" value="random" />
                                <RadioItem label="One-time" value="one-time" />
                            </RadioSet>
                        </Group>

                        <Separator />

                        <Group label="Share">
                            <SubMenu>
                                <SubTrigger label="Social" />
                                <SubPortal>
                                    <SubPositioner>
                                        <SubPopup>
                                            <ButtonItem label="To Facebook" value="to-facebook" />
                                            <ButtonItem label="To Instagram" value="to-instagram" />
                                            <ButtonItem label="To Twitter" value="to-twitter" />

                                            <SubMenu>
                                                <SubTrigger label="More" />
                                                <SubPortal>
                                                    <SubPositioner>
                                                        <SubPopup>
                                                            <ButtonItem label="To Reddit" value="to-reddit" />
                                                            <ButtonItem label="To LinkedIn" value="to-linkedin" />
                                                        </SubPopup>
                                                    </SubPositioner>
                                                </SubPortal>
                                            </SubMenu>
                                        </SubPopup>
                                    </SubPositioner>
                                </SubPortal>
                            </SubMenu>
                            <ButtonItem label="Copy link" value="copy-link" />
                        </Group>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
