"use client";

import { Check } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import { ComboboxProps, Empty, Item, ItemIndicator, List, Popup, Portal, Positioner, Root } from "./atoms";
import { ChipsContainer, ChipsInput, MultipleChip, MultipleChipRemove, Value } from "./atoms-multiple";

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

export default function ComboboxMultipleAsync(props: ComboboxProps) {
    const { children, ...otherProps } = props;
    const containerRef = useRef<HTMLDivElement>(null);
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
        <Root items={items} multiple filter={null} onInputValueChange={handleInputValueChange} {...otherProps}>
            <div className="flex flex-col gap-1 text-sm font-medium">
                <label>Search fruits</label>
                <ChipsContainer ref={containerRef}>
                    <Value>
                        {(value: string[]) => (
                            <>
                                {value.map((fruit) => (
                                    <MultipleChip key={fruit}>
                                        {fruit}
                                        <MultipleChipRemove />
                                    </MultipleChip>
                                ))}
                                <ChipsInput placeholder={value.length > 0 ? "" : "Type to search..."} />
                            </>
                        )}
                    </Value>
                </ChipsContainer>
            </div>
            <Portal>
                <Positioner anchor={containerRef}>
                    <Popup>
                        <Empty>{isPending ? "Searching..." : "No results found"}</Empty>
                        <List>
                            {(item: string) => (
                                <Item key={item} value={item}>
                                    <ItemIndicator>
                                        <Check className="size-3" />
                                    </ItemIndicator>
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
