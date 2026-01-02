"use client";

import { Item, List, Placeholder, Popup, Portal, Positioner, Trigger, Value } from "@comps/atoms/select/atoms";
import Select, { ItemType } from "@comps/atoms/select/select";
import { useState } from "react";

export default function SelectOrder() {
    const [selected, setSelected] = useState<string | string[] | null>(null);

    const placeholder = "Select order";

    const items: ItemType = {
        asc: "Ascending",
        desc: "Descending",
    };

    return (
        <Select selected={selected} setSelected={setSelected}>
            <Trigger>
                <Value>{(value) => (value ? items[value as string] : placeholder)}</Value>
            </Trigger>
            <Portal>
                <Positioner alignItemWithTrigger>
                    <Popup>
                        <List>
                            <Placeholder label={placeholder} />
                            <Item label="Ascending" itemKey="asc" />
                            <Item label="Descending" itemKey="desc" />
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Select>
    );
}
