"use client";

import Select, {
    Icon,
    Item,
    ItemIndicator,
    ItemText,
    List,
    Popup,
    Portal,
    Positioner,
    Trigger,
    Value,
    renderValue,
} from "@atoms/select";
import { OrderValue } from "../_lib/query-params";
import { useQueryParams } from "../_lib/use-query-params";

const items: Record<string, string> = {
    asc: "Ascending (A-Z)",
    desc: "Descending (Z-A)",
};

const placeholder = "Select order";

export default function SelectOrder() {
    const { order, setOrder } = useQueryParams();

    return (
        <Select value={order} onValueChange={(value) => setOrder(value as OrderValue | null)}>
            <Trigger className="w-full max-w-full">
                <Value>{(value) => renderValue({ value, items, placeholder })}</Value>
                <Icon />
            </Trigger>
            <Portal>
                <Positioner alignItemWithTrigger>
                    <Popup>
                        <List>
                            {Object.entries(items).map(([key, label]) => (
                                <Item key={key} value={key}>
                                    <ItemIndicator />
                                    <ItemText>{label}</ItemText>
                                </Item>
                            ))}
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Select>
    );
}
