"use client";

import { useCallback, useState, useTransition } from "react";
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

const everyFruit = [
    "Apple",
    "Banana",
    "Blueberry",
    "Cherry",
    "Grapes",
    "Mango",
    "Orange",
    "Peach",
    "Pineapple",
    "Strawberry",
];

function simulateSearch(query: string): Promise<string[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(everyFruit.filter((f) => f.toLowerCase().includes(query.toLowerCase())));
        }, 300);
    });
}

export default function ComboboxAsync(props: ComboboxProps) {
    const { children, ...otherProps } = props;
    const [items, setItems] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleInputValueChange = useCallback((value: string) => {
        if (!value.trim()) {
            setItems([]);
            return;
        }
        startTransition(async () => {
            const results = await simulateSearch(value);
            setItems(results);
        });
    }, []);

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root items={items} filter={null} onInputValueChange={handleInputValueChange} {...otherProps}>
            <div className="relative flex flex-col gap-1 text-sm font-medium">
                <label>Search a fruit</label>
                <div className="relative">
                    <Input placeholder="Type to search..." />
                    <div className="absolute right-2 bottom-0 flex h-10 items-center">
                        <Clear />
                        <Trigger />
                    </div>
                </div>
            </div>
            <Portal>
                <Positioner>
                    <Popup>
                        <Empty>{isPending ? "Searching..." : "No results found"}</Empty>
                        <List>
                            {(item: string) => (
                                <Item key={item} value={item}>
                                    <ItemIndicator />
                                    <span className="col-start-2">{item}</span>
                                </Item>
                            )}
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
