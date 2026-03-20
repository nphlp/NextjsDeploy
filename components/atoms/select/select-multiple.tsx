"use client";

import { Separator } from "@base-ui/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
    Group,
    Item,
    ItemType,
    List,
    Popup,
    Portal,
    Positioner,
    Root,
    SetSelectedItemType,
    Trigger,
    Value,
} from "./atoms";
import { renderValue } from "./utils";

type SelectMultipleProps = {
    children?: ReactNode;
    selected?: string[];
    setSelected?: Dispatch<SetStateAction<string[]>>;
};

export default function SelectMultiple(props: SelectMultipleProps) {
    const { selected, setSelected, children } = props;

    const handleSelect: SetSelectedItemType = (value) => {
        setSelected?.(value as string[]);
    };

    if (children)
        return (
            <Root selected={selected} onSelect={handleSelect} multiple>
                {children}
            </Root>
        );

    const placeholder = "Select multiple options";

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
        <Root selected={selected} onSelect={handleSelect} multiple>
            <Trigger>
                <Value>{(value) => renderValue({ placeholder, value, items })}</Value>
            </Trigger>

            <Portal>
                <Positioner>
                    <Popup withScrollArrows>
                        <List>
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
