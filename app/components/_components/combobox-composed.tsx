"use client";

import {
    Clear,
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
} from "@atoms/combobox";

const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];

export default function ComboboxComposed() {
    return (
        <Root items={colors}>
            <div className="relative flex flex-col gap-1 text-sm font-medium">
                <label>Pick a color</label>
                <div className="relative">
                    <Input placeholder="e.g. Red" />
                    <div className="absolute right-2 bottom-0 flex h-10 items-center">
                        <Clear />
                        <Trigger />
                    </div>
                </div>
            </div>
            <Portal>
                <Positioner>
                    <Popup>
                        <Empty />
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
