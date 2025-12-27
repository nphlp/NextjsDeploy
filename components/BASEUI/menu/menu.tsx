"use client";

import { ReactNode } from "react";
import { Item, Popup, Portal, Positioner, Root, Trigger } from "./atoms";
import { MenuItem } from "./types";

const exampleItems: MenuItem[] = [
    { type: "button", label: "Play/Pause", value: "play-pause", onItemClick: (value: string) => console.log(value) },
    { type: "separator" },
    {
        type: "group",
        label: "My lists",
        items: [
            { type: "checkbox", label: "Like", value: "like", defaultChecked: true },
            { type: "checkbox", label: "Favorite", value: "favorite" },
        ],
    },
    { type: "separator" },
    {
        type: "group",
        label: "Repeat mode",
        items: [
            {
                type: "radio-group",
                defaultValue: "disabled",
                displayUnselectedIcon: true,
                items: [
                    { label: "Disabled", value: "disabled" },
                    { label: "Random", value: "random" },
                    { label: "One-time", value: "one-time" },
                ],
            },
        ],
    },
    { type: "separator" },
    {
        type: "group",
        label: "Share",
        items: [
            {
                type: "sub-menu",
                label: "Social",
                items: [
                    {
                        type: "button",
                        label: "To Facebook",
                        value: "to-facebook",
                        onItemClick: (value: string) => console.log(value),
                    },
                    {
                        type: "button",
                        label: "To Instagram",
                        value: "to-instagram",
                        onItemClick: (value: string) => console.log(value),
                    },
                    {
                        type: "button",
                        label: "To Twitter",
                        value: "to-twitter",
                        onItemClick: (value: string) => console.log(value),
                    },
                    {
                        type: "sub-menu",
                        label: "More",
                        items: [
                            {
                                type: "button",
                                label: "To Reddit",
                                value: "to-reddit",
                                onItemClick: (value: string) => console.log(value),
                            },
                            {
                                type: "button",
                                label: "To LinkedIn",
                                value: "to-linkedin",
                                onItemClick: (value: string) => console.log(value),
                            },
                        ],
                    },
                ],
            },
            {
                type: "button",
                label: "Copy link",
                value: "copy-link",
                onItemClick: (value: string) => console.log(value),
            },
        ],
    },
];

type MenuProps = {
    /** Menu trigger label */
    label?: string;
    items?: MenuItem[];

    children?: ReactNode;

    /**
     * Offset distance between the trigger and the popover
     */
    sideOffset?: number;
    /**
     * Display an arrow pointing to the trigger
     */
    popoverWithoutArrow?: boolean;
    /**
     * Open the menu when hovering over the trigger
     */
    openOnHover?: boolean;
};

export default function Menu(props: MenuProps) {
    const {
        label = "Song action",
        items = exampleItems,
        children,
        sideOffset,
        popoverWithoutArrow,
        openOnHover,
    } = props;

    if (children) {
        return <Root>{children}</Root>;
    }

    return (
        <Root>
            <Trigger label={label} openOnHover={openOnHover} />
            <Portal>
                <Positioner sideOffset={sideOffset}>
                    <Popup popoverWithoutArrow={popoverWithoutArrow}>
                        {items.map((item, index) => Item({ item, index }))}
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
