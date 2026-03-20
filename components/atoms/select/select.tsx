"use client";

import {
    Group,
    GroupLabel,
    Icon,
    Item,
    ItemIndicator,
    ItemText,
    List,
    Popup,
    Portal,
    Positioner,
    Root,
    ScrollDownArrow,
    ScrollUpArrow,
    SelectProps,
    Separator,
    Trigger,
    Value,
} from "./atoms";
import { renderValue } from "./utils";

const items: Record<string, string> = {
    arial: "Arial",
    helvetica: "Helvetica",
    inter: "Inter",
    timesNewRoman: "Times New Roman",
    georgia: "Georgia",
    garamond: "Garamond",
    courierNew: "Courier New",
    firaCode: "Fira Code",
    jetbrainsMono: "JetBrains Mono",
};

const itemsArray = Object.entries(items);

const placeholder = "Select a font";

export default function Select(props: SelectProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>
                <Value>{(value) => renderValue({ value, items, placeholder })}</Value>
                <Icon />
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <ScrollUpArrow />
                        <List>
                            <Item value={null}>
                                <ItemIndicator />
                                <ItemText>{placeholder}</ItemText>
                            </Item>
                            <Separator />
                            <Group>
                                <GroupLabel>Sans-serif</GroupLabel>
                                {itemsArray.slice(0, 3).map(([key, label]) => (
                                    <Item key={key} value={key}>
                                        <ItemIndicator />
                                        <ItemText>{label}</ItemText>
                                    </Item>
                                ))}
                            </Group>
                            <Separator />
                            <Group>
                                <GroupLabel>Serif</GroupLabel>
                                {itemsArray.slice(3, 6).map(([key, label]) => (
                                    <Item key={key} value={key}>
                                        <ItemIndicator />
                                        <ItemText>{label}</ItemText>
                                    </Item>
                                ))}
                            </Group>
                            <Separator />
                            <Group>
                                <GroupLabel>Monospace</GroupLabel>
                                {itemsArray.slice(6, 9).map(([key, label]) => (
                                    <Item key={key} value={key}>
                                        <ItemIndicator />
                                        <ItemText>{label}</ItemText>
                                    </Item>
                                ))}
                            </Group>
                        </List>
                        <ScrollDownArrow />
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
