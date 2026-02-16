"use client";

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

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

export default function Combobox(props: ComboboxProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root items={fruits} {...otherProps}>
            <div className="relative flex flex-col gap-1 text-sm font-medium">
                <label>Choose a fruit</label>
                <div className="relative">
                    <Input placeholder="e.g. Apple" />
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
