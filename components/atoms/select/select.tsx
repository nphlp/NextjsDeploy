"use client";

import { useFormContext } from "@atoms/form/_context/use-form-context";
import { Separator } from "@base-ui/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
    Group,
    Item,
    ItemType,
    List,
    Placeholder,
    Popup,
    Portal,
    Positioner,
    Root,
    SetSelectedItemType,
    Trigger,
    Value,
} from "./atoms";
import { renderValue } from "./utils";

type SelectProps = {
    children?: ReactNode;
    selected?: string | null;
    setSelected?: Dispatch<SetStateAction<string | null>>;
    name?: string;
    useForm?: boolean;
};

export default function Select(props: SelectProps) {
    const { selected, setSelected, name, useForm = false, children } = props;

    // Form and Field context
    const register = useFormContext();
    const field = useForm && name ? register(name) : null;

    const resolvedSelected = field ? field.value : selected;

    const handleSelect: SetSelectedItemType = (value) => {
        field?.onChange(value);
        setSelected?.(value as string | null);
    };

    if (children)
        return (
            <Root selected={resolvedSelected} onSelect={handleSelect}>
                {children}
            </Root>
        );

    const placeholder = "Select an option";

    const items: ItemType = {
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

    return (
        <Root selected={resolvedSelected} onSelect={handleSelect}>
            <Trigger>
                <Value>{(value) => renderValue({ placeholder, value, items })}</Value>
            </Trigger>

            <Portal>
                <Positioner alignItemWithTrigger>
                    <Popup withScrollArrows>
                        <List>
                            <Placeholder label={placeholder} />

                            <Group label="Sans-serif">
                                <Item label="Arial" itemKey="arial" />
                                <Item label="Helvetica" itemKey="helvetica" />
                                <Item label="Inter" itemKey="inter" />
                            </Group>

                            <Separator />

                            <Group label="Serif">
                                <Item label="Times New Roman" itemKey="timesNewRoman" />
                                <Item label="Georgia" itemKey="georgia" />
                                <Item label="Garamond" itemKey="garamond" />
                            </Group>

                            <Separator />

                            <Group label="Monospace">
                                <Item label="Courier New" itemKey="courierNew" />
                                <Item label="Fira Code" itemKey="firaCode" />
                                <Item label="JetBrains Mono" itemKey="jetbrainsMono" />
                            </Group>
                        </List>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
