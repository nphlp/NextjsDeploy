import { ReactNode } from "react";
import { ItemType, SelectedItemType } from "./atoms";

// Condition helpers
const isNullOrEmpty = (value: SelectedItemType): boolean => !value?.length;

const isString = (value: SelectedItemType) => typeof value === "string";

const isArray = (value: SelectedItemType) => Array.isArray(value);

// Formatting helpers
const displayLabel = (value: string, items: ItemType) => items[value];

const displayLabelArray = {
    joinedByComma: (value: string[], items: ItemType) => {
        return value.map((v) => items[v]).join(", ");
    },
    selectedCounter: (value: string[]) => {
        return value.length > 1 ? `${value.length} items` : `${value.length} item`;
    },
    firstItemAndMore: (value: string[], items: ItemType) => {
        const firstLanguage = items[value[0]];
        const additionalLanguages = value.length > 1 ? ` (+${value.length - 1} more)` : "";
        return firstLanguage + additionalLanguages;
    },
};

export type FormattingFnType = keyof typeof displayLabelArray;

export const renderValue = (props: {
    value: SelectedItemType;
    items: ItemType;
    placeholder: string;
    formattingFn?: FormattingFnType;
    customDisplayLabelArray?: (value: string[], items: ItemType) => ReactNode;
}) => {
    const { value, items, placeholder, formattingFn = "joinedByComma", customDisplayLabelArray } = props;

    // Nothing selected, display placeholder
    if (isNullOrEmpty(value)) return placeholder;

    // Single selection mode, display label
    if (isString(value)) return displayLabel(value, items);

    // Multiple selection mode, display labels formatted
    if (isArray(value)) {
        if (customDisplayLabelArray) return customDisplayLabelArray(value, items);
        return displayLabelArray[formattingFn](value, items);
    }
};
