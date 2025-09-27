import { combo } from "@lib/combo";
import { mergeStylesAndStructure } from "../../../lib/mergeStyles";
import { ButtonClassName } from "./button";

export type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "underline" | "none";

type StructureType = {
    [key in keyof ButtonClassName]-?: ButtonClassName[key];
};

export type StylesType = {
    [key in ButtonVariant]: StructureType;
};

const structure: StructureType = {
    button: combo(
        // Layout
        "flex flex-row items-center justify-center gap-2",
        // Width
        "w-fit",
        // Font
        "",
    ),
    isLoading: combo("disabled:cursor-progress"),
    isDisabled: combo("disabled:cursor-not-allowed"),
    text: combo("whitespace-nowrap text-ellipsis overflow-hidden"),
    loader: combo("size-4 shrink-0 "),
};

export const styles: StylesType = {
    default: {
        button: combo(
            // Normal
            "text-background bg-foreground",
            // Hover
            "hover:bg-gray-high",
            // Padding
            "px-4 py-1.5",
            // Rounded
            "rounded-lg",
        ),
        isLoading: combo("hover:bg-foreground"),
        isDisabled: combo("bg-gray-low text-gray-light", "hover:bg-gray-low hover:text-gray-light"),
        text: combo(""),
        loader: combo("stroke-background"),
    },
    outline: {
        button: combo(
            // Normal
            "border border-gray-low bg-background text-gray-high",
            // Hover
            "hover:border-gray-middle hover:bg-gray-light",
            // Focus
            "focus:border-gray-middle",
            // Padding
            "px-4 py-1.5",
            // Rounded
            "rounded-lg",
        ),
        isLoading: combo("hover:border-gray-low hover:bg-background"),
        isDisabled: combo(
            "border-gray-low text-gray-low",
            "hover:border-gray-low hover:bg-background hover:text-gray-low",
        ),
        text: combo(""),
        loader: combo(""),
    },
    ghost: {
        button: combo(
            // Normal
            "bg-background text-gray-high",
            // Hover
            "hover:bg-gray-light hover:text-foreground",
            // Padding
            "px-4 py-1.5",
            // Rounded
            "rounded-lg",
        ),
        isLoading: combo("hover:bg-background hover:text-gray-high"),
        isDisabled: combo("bg-background text-gray-low", "hover:bg-background hover:text-gray-low"),
        text: combo(""),
        loader: combo(""),
    },
    destructive: {
        button: combo(
            // Normal
            "text-white bg-destructive",
            // Hover
            "hover:bg-destructive-hover",
            // Padding
            "px-4 py-1.5",
            // Rounded
            "rounded-lg",
        ),
        isLoading: combo("hover:bg-destructive"),
        isDisabled: combo("bg-destructive-disabled dark:text-black", "hover:bg-destructive-disabled"),
        text: combo(""),
        loader: combo("stroke-white"),
    },
    underline: {
        button: combo(
            // Normal
            "text-foreground",
            // Hover
            "hover:underline",
            // Rounded
            "rounded px-1",
        ),
        isLoading: combo("hover:no-underline"),
        isDisabled: combo("text-gray-low hover:no-underline"),
        text: combo(""),
        loader: combo(""),
    },
    none: {
        button: combo(""),
        isLoading: combo(""),
        isDisabled: combo(""),
        text: combo(""),
        loader: combo(""),
    },
};

export const theme = mergeStylesAndStructure(structure, styles);
