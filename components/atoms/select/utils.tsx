import { ReactNode } from "react";

type ItemMap = Record<string, string>;

type SelectedValue = string | string[] | null;

// Formatting helpers
const displayLabelArray = {
    joinedByComma: (value: string[], items: ItemMap) => {
        return value.map((v) => items[v]).join(", ");
    },
    selectedCounter: (value: string[]) => {
        return value.length > 1 ? `${value.length} items` : `${value.length} item`;
    },
    firstItemAndMore: (value: string[], items: ItemMap) => {
        const firstItem = items[value[0]];
        const additional = value.length > 1 ? ` (+${value.length - 1} more)` : "";
        return firstItem + additional;
    },
};

export type FormattingFnType = keyof typeof displayLabelArray;

export const renderValue = (props: {
    value: SelectedValue;
    items: ItemMap;
    placeholder: string;
    formattingFn?: FormattingFnType;
    customDisplayLabelArray?: (value: string[], items: ItemMap) => ReactNode;
}) => {
    const { value, items, placeholder, formattingFn = "joinedByComma", customDisplayLabelArray } = props;

    // Nothing selected
    if (!value?.length) return placeholder;

    // Single selection
    if (typeof value === "string") return items[value];

    // Multiple selection
    if (Array.isArray(value)) {
        if (customDisplayLabelArray) return customDisplayLabelArray(value, items);
        return displayLabelArray[formattingFn](value, items);
    }
};
