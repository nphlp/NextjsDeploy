"use client";

import { Item, List, Popup, Portal, Positioner, Trigger, Value } from "@comps/atoms/select/atoms";
import { ItemType } from "@comps/atoms/select/atoms";
import Select from "@comps/atoms/select/select";
import { SetStateAction } from "react";
import { OrderValue } from "../_lib/query-params";
import { useQueryParams } from "../_lib/use-query-params";

export default function SelectOrder() {
    const { order, setOrder } = useQueryParams();

    const handleChange = (value: SetStateAction<string | null>) => {
        setOrder(value as OrderValue | null);
    };

    const placeholder = "Select order";

    const items: ItemType = {
        asc: "Ascending (A-Z)",
        desc: "Descending (Z-A)",
    };

    return (
        <Select selected={order} setSelected={handleChange}>
            <Trigger className="w-full max-w-full">
                <Value>{(value) => (value ? items[value as string] : placeholder)}</Value>
            </Trigger>
            <Portal>
                <Positioner alignItemWithTrigger>
                    <Popup>
                        <List>
                            <Item label="Ascending (A-Z)" itemKey="asc" />
                            <Item label="Descending (Z-A)" itemKey="desc" />
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Select>
    );
}
