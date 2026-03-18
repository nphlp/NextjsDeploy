"use client";

import { Check } from "lucide-react";
import { useRef } from "react";
import { ComboboxProps, Empty, Item, ItemIndicator, List, Popup, Portal, Positioner, Root } from "./atoms";
import { ChipsContainer, ChipsInput, MultipleChip, MultipleChipRemove, Value } from "./atoms-multiple";

type ComboboxMultipleAsyncProps = {
    items: string[];
    isFetching?: boolean;
    onSearchChange: (value: string) => void;
} & Omit<ComboboxProps, "children">;

export default function ComboboxMultipleAsync(props: ComboboxMultipleAsyncProps) {
    const { items, isFetching = false, onSearchChange, ...otherProps } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <Root items={items} multiple filter={null} onInputValueChange={onSearchChange} {...otherProps}>
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
                        <Empty>{isFetching ? "Searching..." : "No results found"}</Empty>
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
