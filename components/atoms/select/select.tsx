"use client";

import { Separator } from "@base-ui/react";
import { SelectRootChangeEventDetails } from "@base-ui/react/select";
import { ReactNode } from "react";
import { Group, Item, List, Placeholder, Popup, Portal, Positioner, Root, Trigger, Value } from "./atoms";
import { renderValue } from "./utils";

export type ItemType = {
    [key: string]: string | null;
};

type SelectProps = {
    children?: ReactNode;
    multiple?: boolean;

    /**
     * State management
     * - string for single mode
     * - string[] for multiple mode
     */
    selected?: string | string[] | null;
    setSelected?: (value: string | string[] | null, eventDetails: SelectRootChangeEventDetails) => void;
};

/**
 * TODO
 * - Default value
 * - Disabled component
 * - Disabled items
 * - Est-ce 'isItemEqualToValue' que peut être utile ?
 */

export default function Select(props: SelectProps) {
    const { selected, setSelected, children, multiple } = props;

    if (children)
        return (
            <Root selected={selected} onSelect={setSelected} multiple={multiple}>
                {children}
            </Root>
        );

    const placeholder = multiple ? "Select multiple options" : "Select an option";

    const items: ItemType = {
        arial: "Arial",
        helvetica: "Helvetica",
        inter: "Inter",
        timesNewRoman: "Times New Roman",
        georgia: "Georgia",
        garamond: "Garamond",
        courierNew: "Courier New",
        firaCode: "Fira Code",
        jetbrainsMono: "JetBrains Mono",
    };

    return (
        <Root selected={selected} onSelect={setSelected} multiple={multiple}>
            <Trigger>
                <Value>{(value) => renderValue({ placeholder, value, items })}</Value>
            </Trigger>

            <Portal>
                <Positioner alignItemWithTrigger={!multiple}>
                    <Popup withScrollArrows>
                        <List>
                            {!multiple && <Placeholder label={placeholder} />}

                            <Group label="Sans-serif">
                                <Item label="Arial" itemKey="arial" />
                                <Item label="Helvetica" itemKey="helvetica" />
                                <Item label="Inter" itemKey="inter" />
                            </Group>

                            <Separator />

                            <Group label="Serif">
                                <Item label="Times New Roman" itemKey="timesNewRoman" />
                                <Item label="Georgia" itemKey="georgia" />
                                <Item label="Garamond" itemKey="garamond" />
                            </Group>

                            <Separator />

                            <Group label="Monospace">
                                <Item label="Courier New" itemKey="courierNew" />
                                <Item label="Fira Code" itemKey="firaCode" />
                                <Item label="JetBrains Mono" itemKey="jetbrainsMono" />
                            </Group>
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
