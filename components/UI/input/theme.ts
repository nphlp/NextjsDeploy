import { combo } from "@lib/combo";
import { mergeStylesAndStructure } from "../../../lib/mergeStyles";
import { InputClassName } from "./input";

export type InputVariant = "default" | "none";

type StructureType = {
    [key in keyof InputClassName]-?: InputClassName[key];
};

export type StylesType = {
    [key in InputVariant]: StructureType;
};

const structure: StructureType = {
    component: combo("block space-y-1"),
    label: combo("text-sm font-semibold"),
    input: combo(
        "w-full rounded-lg border px-4 py-1.5",
        // Ring and focus
        "outline-none ring-0 ring-teal-300 focus:ring-2",
        // Transition
        "transition-all duration-150",
    ),
};

export const styles: StylesType = {
    default: {
        component: combo(""),
        label: combo("text-foreground"),
        input: combo(
            "text-foreground placeholder:text-gray-middle",
            "bg-background",
            "border-gray-low focus:border-gray-middle",
        ),
    },
    none: {
        component: combo(""),
        label: combo(""),
        input: combo(""),
    },
};

export const theme = mergeStylesAndStructure(structure, styles);
