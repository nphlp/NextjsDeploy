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

const sansSerif: Record<string, string> = {
    arial: "Arial",
    helvetica: "Helvetica",
    inter: "Inter",
};

const serif: Record<string, string> = {
    timesNewRoman: "Times New Roman",
    georgia: "Georgia",
    garamond: "Garamond",
};

const monospace: Record<string, string> = {
    courierNew: "Courier New",
    firaCode: "Fira Code",
    jetbrainsMono: "JetBrains Mono",
};

const everyItem: Record<string, string> = { ...sansSerif, ...serif, ...monospace };

const placeholder = "Select fonts";

export default function SelectMultiple(props: SelectProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return (
            <Root multiple {...otherProps}>
                {children}
            </Root>
        );
    }

    return (
        <Root multiple {...otherProps}>
            <Trigger>
                <Value>{(value) => renderValue({ value, items: everyItem, placeholder })}</Value>
                <Icon />
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <ScrollUpArrow />
                        <List>
                            <Group>
                                <GroupLabel>Sans-serif</GroupLabel>
                                {Object.entries(sansSerif).map(([key, label]) => (
                                    <Item key={key} value={key}>
                                        <ItemIndicator />
                                        <ItemText>{label}</ItemText>
                                    </Item>
                                ))}
                            </Group>

                            <Separator />

                            <Group>
                                <GroupLabel>Serif</GroupLabel>
                                {Object.entries(serif).map(([key, label]) => (
                                    <Item key={key} value={key}>
                                        <ItemIndicator />
                                        <ItemText>{label}</ItemText>
                                    </Item>
                                ))}
                            </Group>

                            <Separator />

                            <Group>
                                <GroupLabel>Monospace</GroupLabel>
                                {Object.entries(monospace).map(([key, label]) => (
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
