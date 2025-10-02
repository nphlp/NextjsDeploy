import { combo } from "@lib/combo";
import { mergeStylesAndStructure } from "@lib/mergeStyles";
import { SelectClassName } from "./select";

export type VariantType = "default" | "none";

type StructureType = {
    [key in keyof SelectClassName]-?: SelectClassName[key];
};

export type StylesType = {
    [key in VariantType]: StructureType;
};

const structure: StructureType = {
    component: combo("block"),
    label: combo("text-sm font-semibold mb-1"),

    displayedValue: combo(""),
    placeholder: combo(""),

    buttonGroup: combo("relative"),
    button: combo(
        // Text
        "text-foreground text-left line-clamp-1 overflow-hidden text-ellipsis",
        // Size and padding
        "w-full",
        // Outline
        "outline-none focus:ring-2 ring-teal-300",
        "transition-all duration-150",
        // Accessibility
        "cursor-pointer",
    ),

    subButton: combo(
        // Position
        "absolute right-2 top-1/2 -translate-y-1/2",
        // Outline
        "outline-none focus:ring-2 ring-teal-300",
        "transition-all duration-150",
        // Accessibility
        "cursor-pointer",
    ),
    subCross: combo("size-6"),

    subDiv: combo(
        // Position
        "absolute right-2 top-1/2 -translate-y-1/2",
        // Accessibility
        "pointer-events-none",
    ),
    subChevron: combo("size-6"),

    optionList: combo(
        // Position
        "absolute z-50",
        // Size and padding
        "w-full",
    ),
    optionButton: combo(
        // Display
        "flex items-center gap-2",
        // Border and radius
        "rounded",
        // Text
        "text-foreground text-sm",
        // Size and padding
        "w-full px-2 py-1",
        // Accessibility
        "cursor-pointer",
    ),
    optionIcon: combo("size-5 stroke-[2.5px]"),
    optionLabel: combo(""),
};

const styles: StylesType = {
    default: {
        component: combo(""),
        label: combo("text-foreground"),

        displayedValue: combo("text-foreground"),
        placeholder: combo("text-gray-middle"),

        buttonGroup: combo(""),
        button: combo(
            // Text
            "text-left",
            // Size and padding
            "px-4 py-1.5 w-full",
            // Border and radius
            "border border-gray-low focus:border-gray-high rounded-lg",
            // Background
            "bg-background",
        ),

        subButton: combo(
            // Position
            "absolute right-2 top-1/2 -translate-y-1/2",
            // Border and radius
            "rounded",
        ),
        subCross: combo("stroke-gray-high"),

        subDiv: combo(""),
        subChevron: combo("stroke-gray-high translate-y-px"),

        optionList: combo(
            // Position
            "absolute",
            // Size and padding
            "w-full p-1",
            // Border and radius
            "border border-gray-low rounded-lg",
            // Background
            "bg-background",
        ),
        optionButton: combo(
            // Text
            "text-foreground text-sm",
            // Background
            "bg-background hover:bg-gray-light",
            // Outline
            "outline-none focus:bg-gray-low",
        ),
        optionIcon: combo(""),
        optionLabel: combo(""),
    },
    none: {
        component: combo(""),
        label: combo(""),
        displayedValue: combo(""),
        placeholder: combo(""),
        buttonGroup: combo(""),
        button: combo(""),
        subButton: combo(""),
        subCross: combo(""),
        subDiv: combo(""),
        subChevron: combo(""),
        optionList: combo(""),
        optionButton: combo(""),
        optionIcon: combo(""),
        optionLabel: combo(""),
    },
};

export const theme = mergeStylesAndStructure(structure, styles);
