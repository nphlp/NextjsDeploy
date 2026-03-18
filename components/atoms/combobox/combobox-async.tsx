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

type ComboboxAsyncProps = {
    items: string[];
    isFetching?: boolean;
    onSearchChange: (value: string) => void;
} & Omit<ComboboxProps, "children">;

export default function ComboboxAsync(props: ComboboxAsyncProps) {
    const { items, isFetching = false, onSearchChange, ...otherProps } = props;

    return (
        <Root items={items} filter={null} onInputValueChange={onSearchChange} {...otherProps}>
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
                        <Empty>{isFetching ? "Searching..." : "No results found"}</Empty>
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
