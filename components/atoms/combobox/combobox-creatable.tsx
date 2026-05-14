"use client";

import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
    Clear,
    ComboboxProps,
    Empty,
    Input,
    Item,
    ItemIndicator,
    List,
    Popup,
    Portal,
    Positioner,
    Root,
    Trigger,
} from "./atoms";

type Fruit = {
    id: string;
    value: string;
    creatable?: string;
};

const initialFruits: Fruit[] = [
    { id: "apple", value: "Apple" },
    { id: "banana", value: "Banana" },
    { id: "blueberry", value: "Blueberry" },
    { id: "grapes", value: "Grapes" },
    { id: "pineapple", value: "Pineapple" },
];

/**
 * Creatable combobox demo — pick an existing item OR create a new one on the fly.
 * Mirrors Base UI's official creatable pattern: a synthetic `{creatable, ...}`
 * item is appended to the items list when the input doesn't match any entry,
 * and the selection handler branches on the `creatable` flag.
 *
 * When children are passed, the component is a thin `<Root>` wrapper so callers
 * can compose their own primitives. The default render is reference-only —
 * app code should build the combobox directly from `./atoms` exports.
 */
export default function ComboboxCreatable(props: ComboboxProps) {
    const { children, ...otherProps } = props;

    const [items, setItems] = useState<Fruit[]>(initialFruits);
    const [selected, setSelected] = useState<Fruit | null>(null);
    const [query, setQuery] = useState("");

    const trimmed = query.trim();
    const lowered = trimmed.toLocaleLowerCase();
    const exactExists = items.some((item) => item.value.toLocaleLowerCase() === lowered);

    const itemsForView = useMemo<Fruit[]>(() => {
        if (trimmed === "" || exactExists) return items;
        return [...items, { id: `create:${lowered}`, value: `Create "${trimmed}"`, creatable: trimmed }];
    }, [items, trimmed, lowered, exactExists]);

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    const handleValueChange = (value: unknown) => {
        const item = value as Fruit | null;
        if (!item) return;
        if (item.creatable) {
            const newItem: Fruit = {
                id: item.creatable.toLocaleLowerCase().replace(/\s+/g, "-"),
                value: item.creatable,
            };
            setItems((prev) => (prev.some((i) => i.id === newItem.id) ? prev : [...prev, newItem]));
            setSelected(newItem);
            setQuery(newItem.value);
            return;
        }
        setSelected(item);
        setQuery(item.value);
    };

    return (
        <Root
            items={itemsForView}
            itemToStringLabel={(item: unknown) => {
                const fruit = item as Fruit;
                // For creatable items, return the raw value (`xxx`) rather than
                // the rendered label (`Create "xxx"`). Otherwise Base UI syncs
                // the input to `Create "xxx"` on click before our
                // onValueChange handler can replace it — visible flash.
                return fruit.creatable ?? fruit.value;
            }}
            value={selected}
            onValueChange={handleValueChange}
            inputValue={query}
            onInputValueChange={setQuery}
            {...otherProps}
        >
            <div className="relative flex flex-col gap-1 text-sm font-medium">
                <label>Choose or create a fruit</label>
                <div className="relative">
                    <Input placeholder="e.g. Apple, or type a new name…" />
                    <div className="absolute right-2 bottom-0 flex h-10 items-center">
                        <Clear />
                        <Trigger />
                    </div>
                </div>
            </div>
            <Portal>
                <Positioner>
                    <Popup>
                        <Empty>No fruits found.</Empty>
                        <List>
                            {(item: Fruit) =>
                                item.creatable ? (
                                    <Item key={item.id} value={item}>
                                        <span className="col-start-1">
                                            <Plus className="size-3" />
                                        </span>
                                        <span className="col-start-2">Create &quot;{item.creatable}&quot;</span>
                                    </Item>
                                ) : (
                                    <Item key={item.id} value={item}>
                                        <ItemIndicator>
                                            <Check className="size-3" />
                                        </ItemIndicator>
                                        <span className="col-start-2">{item.value}</span>
                                    </Item>
                                )
                            }
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
