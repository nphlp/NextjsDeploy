import { combo } from "@lib/combo";
import { mergeStylesAndStructure } from "@lib/mergeStyles";
import { DrawerClassName } from "./drawer";

export type DrawerVariant = "default" | "none";

type StructureType = {
    [key in keyof DrawerClassName]-?: DrawerClassName[key];
};

export type StylesType = {
    [key in DrawerVariant]: StructureType;
};

const structure: StructureType = {
    component: combo(
        // Position
        "absolute top-0 left-0 z-50 h-screen w-screen",
        // Scroll
        "overflow-hidden",
    ),
    drawer: combo(
        // Position
        "absolute h-full right-0 z-50",
        // Spacing
        "px-8 py-10",
    ),
    backgroundButton: combo("absolute inset-0"),
    backgroundBlur: combo("absolute inset-0"),
    backgroundColor: combo("absolute inset-0"),
    closeButton: combo(
        // Position
        "absolute top-3 right-3",
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
        drawer: combo(
            // Background
            "bg-background",
        ),
        backgroundButton: combo(""),
        backgroundBlur: combo("backdrop-blur-[1.5px]"),
        backgroundColor: combo("bg-foreground/50 dark:bg-foreground/20"),
        closeButton: combo("bg-transparent hover:bg-gray-low focus:bg-gray-light"),
        closeIcon: combo("stroke-[2.2px] text-foreground"),
    },
    none: {
        component: combo(""),
        drawer: combo(""),
        backgroundButton: combo(""),
        backgroundBlur: combo(""),
        backgroundColor: combo(""),
        closeButton: combo(""),
        closeIcon: combo(""),
    },
};

export const theme = mergeStylesAndStructure(structure, styles);
