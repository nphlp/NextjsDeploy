"use client";

import { Check } from "lucide-react";
import { useRef } from "react";
import { ComboboxProps, Empty, Item, ItemIndicator, List, Popup, Portal, Positioner, Root } from "./atoms";
import { ChipsContainer, ChipsInput, MultipleChip, MultipleChipRemove, Value } from "./atoms-multiple";

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export default function ComboboxMultiple(props: ComboboxProps) {
    const { children, ...otherProps } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    if (children) {
        return (
            <Root multiple {...otherProps}>
                {children}
            </Root>
        );
    }

    return (
        <Root items={fruits} multiple {...otherProps}>
            <div className="flex flex-col gap-1 text-sm font-medium">
                <label>Choose fruits</label>
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
                                <ChipsInput placeholder={value.length > 0 ? "" : "e.g. Apple"} />
                            </>
                        )}
                    </Value>
                </ChipsContainer>
            </div>
            <Portal>
                <Positioner anchor={containerRef}>
                    <Popup>
                        <Empty />
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
