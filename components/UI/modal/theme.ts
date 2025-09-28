import { combo } from "@lib/combo";
import { mergeStylesAndStructure } from "@lib/mergeStyles";
import { ModalClassName } from "./modal";

export type ModalVariant = "default" | "none";

type StructureType = {
    [key in keyof ModalClassName]-?: ModalClassName[key];
};

export type StylesType = {
    [key in ModalVariant]: StructureType;
};

const structure: StructureType = {
    component: combo(
        // Position
        "absolute top-0 left-0 z-50 h-screen w-screen",
        // Scroll
        "overflow-auto",
    ),
    subComponent: combo(
        // Layout
        "flex flex-col items-center justify-center min-h-full relative",
    ),
    cardContainer: combo("p-7"),
    card: combo(
        // Position
        "relative z-50",
        // Size and padding
        "px-12 py-8",
    ),
    backgroundButton: combo("absolute inset-0"),
    backgroundBlur: combo("absolute inset-0"),
    backgroundColor: combo("absolute inset-0"),
    closeButton: combo(
        // Position
        "absolute top-2 right-2",
        // Spacing
        "p-1",
        // Outline
        "outline-none focus:ring-2 ring-teal-300",
        "transition-all duration-150",
        // Accessibility
        "cursor-pointer",
        // Border and radius
        "rounded-lg",
    ),
    closeIcon: combo("size-6"),
};

export const styles: StylesType = {
    default: {
        component: combo(""),
        subComponent: combo(""),
        cardContainer: combo(""),
        card: combo(
            // Background and backdrop
            "bg-background text-foreground shadow-md",
            // Border and radius
            "rounded-xl border border-gray-low",
        ),
        backgroundButton: combo(""),
        backgroundBlur: combo("backdrop-blur-[1.5px]"),
        backgroundColor: combo("bg-foreground/50 dark:bg-foreground/20"),
        closeButton: combo("bg-transparent hover:bg-gray-low focus:bg-gray-light"),
        closeIcon: combo("stroke-[2.2px] text-foreground"),
    },
    none: {
        component: combo(""),
        subComponent: combo(""),
        cardContainer: combo(""),
        card: combo(""),
        backgroundButton: combo(""),
        backgroundBlur: combo(""),
        backgroundColor: combo(""),
        closeButton: combo(""),
        closeIcon: combo(""),
    },
};

export const theme = mergeStylesAndStructure(structure, styles);
