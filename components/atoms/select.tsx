"use client";

import { Select as SelectBaseUi, SelectRootChangeEventDetails } from "@base-ui/react/select";
import { cn } from "@comps/SHADCN/lib/utils";
import { CheckIcon, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { ReactNode } from "react";

type SelectableItem = { type: "item"; label: string; value: string };
type SeparatorItem = { type: "separator" };
type GroupItem = { type: "group"; label: string };
type PlaceholderItem = { type: "placeholder"; label: string };

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

export type SelectItem = SelectableItem | SeparatorItem | GroupItem;

const itemsExample: SelectItem[] = [
    { type: "group", label: "Sans-serif" },
    { type: "item", label: "Arial", value: "arial" },
    { type: "item", label: "Helvetica", value: "helvetica" },
    { type: "item", label: "Inter", value: "inter" },
    { type: "separator" },
    { type: "group", label: "Serif" },
    { type: "item", label: "Times New Roman", value: "times-new-roman" },
    { type: "item", label: "Georgia", value: "georgia" },
    { type: "item", label: "Garamond", value: "garamond" },
    { type: "separator" },
    { type: "group", label: "Monospace" },
    { type: "item", label: "Courier New", value: "courier-new" },
    { type: "item", label: "Fira Code", value: "fira-code" },
    { type: "item", label: "JetBrains Mono", value: "jetbrains-mono" },
];

type SelectProps = {
    /** Placeholder text when no item is selected */
    placeholder?: string;
    /** Items to display in the select dropdown */
    items?: SelectItem[];
    /** Switch between single and multiple selection */
    multiple?: boolean;
    /**
     * Display mode for selected items in multiple selection mode
     * - joinedByComma (single and multiple mode): display selected items joined by commas
     * - selectedCounter (multiple mode only): display a counter of selected items
     */
    displayMode?: "joinedByComma" | "selectedCounter";

    /**
     * Offset distance between the trigger and the popover
     */
    sideOffset?: number;
    side?: Side;
    align?: Align;
    /** Replace default popup dropdown alignment with trigger alignment */
    alignItemWithTrigger?: boolean;
    /** Replace default scroll bar with up and down arrows */
    withScrollArrows?: boolean;

    /**
     * State management
     * - string for single mode
     * - string[] for multiple mode
     */
    selected?: string | string[] | null;
    onSelect?: (value: string | string[] | null, eventDetails: SelectRootChangeEventDetails) => void;
} & (
    | {
          multiple?: false;
          displayMode?: "joinedByComma";
      }
    | {
          multiple: true;
          displayMode?: "joinedByComma" | "selectedCounter";
      }
);

/**
 * TODO
 * - Default value
 * - Disabled component
 * - Disabled items
 * - Est-ce 'isItemEqualToValue' que peut être utile ?
 */

export default function Select(props: SelectProps) {
    const {
        placeholder: providedPlaceholder,
        items = itemsExample,
        multiple = false,
        displayMode = "joinedByComma",
        sideOffset = 8,
        side = "bottom",
        align = "center",
        alignItemWithTrigger = false,
        withScrollArrows = false,
        selected,
        onSelect,
    } = props;

    const placeholderExample = multiple ? "Select multiple options" : "Select an option";
    const placeholder = providedPlaceholder ?? placeholderExample;

    const selectableItems: SelectableItem[] = items.filter((item) => item.type === "item");

    const formattingFn = {
        joinedByComma: (value: SelectableItem["value"][]) => {
            if (!value?.length) return placeholder;
            const selectedItems = selectableItems.filter((item) => value.includes(item.value));
            return selectedItems.map((v) => v.label).join(", ");
        },
        selectedCounter: (value: SelectableItem["value"][]) => {
            if (!value?.length) return placeholder;
            return value.length > 1 ? `${value.length} items` : `${value.length} item`;
        },
    };

    return (
        <Root items={selectableItems} value={selected} onValueChange={onSelect} multiple={multiple}>
            <Trigger>
                <Value className="text-start">{formattingFn[displayMode]}</Value>
            </Trigger>

            <Portal>
                <Positioner
                    className={cn("z-10", "outline-none", "select-none")}
                    sideOffset={sideOffset}
                    side={side}
                    align={align}
                    alignItemWithTrigger={alignItemWithTrigger}
                >
                    <Popup>
                        <ScrollArrow visible={withScrollArrows} direction="up" />
                        <List>
                            {/* Placeholder in single mode */}
                            {!multiple && <Item item={{ type: "placeholder", label: placeholder }} />}

                            {/* Items buttons */}
                            {items.map((item, index) => (
                                // Prefer using value as key for selectable items for better performance
                                // And index key for non-selectable items that don't have value
                                <Item key={item.type === "item" ? item.value : index} item={item} />
                            ))}
                        </List>
                        <ScrollArrow visible={withScrollArrows} direction="down" />
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}

// Subcomponents
const { Root, Value, Portal, Positioner } = SelectBaseUi;

const Trigger = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <SelectBaseUi.Trigger
            className={cn(
                // Layout
                "max-w- flex min-h-10 max-w-60 min-w-36 items-center justify-between gap-3 py-1.5 pr-3 pl-3.5",
                // Border
                "rounded-md border border-gray-200",
                "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800",
                // Background
                "bg-white hover:bg-gray-100 data-popup-open:bg-gray-100",
                // Text
                "text-base text-gray-900 select-none",
            )}
        >
            {children}

            <SelectBaseUi.Icon className="flex">
                <ChevronsUpDown className="size-4" />
            </SelectBaseUi.Icon>
        </SelectBaseUi.Trigger>
    );
};

const Popup = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <SelectBaseUi.Popup
            className={cn(
                // Layout
                "group min-w-(--anchor-width) origin-(--transform-origin)",
                "data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]",
                // Border
                "rounded-md outline outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-white bg-clip-padding",
                // Text
                "text-gray-900",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
                "data-[side=none]:data-ending-style:transition-none",
                "data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none",
            )}
        >
            {children}
        </SelectBaseUi.Popup>
    );
};

const List = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <SelectBaseUi.List
            className={cn(
                // Layout
                "relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1",
            )}
        >
            {children}
        </SelectBaseUi.List>
    );
};

const Item = (props: { item: SelectableItem | SeparatorItem | GroupItem | PlaceholderItem; className?: string }) => {
    const { item, className } = props;

    if (item.type === "separator") {
        return <SelectBaseUi.Separator className="mx-4 my-1.5 h-px bg-gray-200" />;
    }

    if (item.type === "group") {
        return (
            <SelectBaseUi.Group>
                <SelectBaseUi.GroupLabel className="cursor-default py-2 pr-8 pl-6.5 text-sm leading-4 text-gray-500 select-none">
                    {item.label}
                </SelectBaseUi.GroupLabel>
            </SelectBaseUi.Group>
        );
    }

    return (
        <SelectBaseUi.Item
            value={item.type === "placeholder" ? null : item.value}
            className={cn(
                // Layout
                "grid grid-cols-[1rem_1fr] items-center gap-2.5 py-2 pr-4 pl-3",
                "group-data-[side=none]:pr-12",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                "pointer-coarse:py-2.5",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "group-data-[side=none]:text-base group-data-[side=none]:leading-4",
                "data-highlighted:text-gray-50",
                "pointer-coarse:text-[0.925rem]",
                // Overrides
                className,
            )}
        >
            <SelectBaseUi.ItemIndicator className="col-start-1">
                <CheckIcon className="size-4" />
            </SelectBaseUi.ItemIndicator>
            <SelectBaseUi.ItemText className="col-start-2">{item.label}</SelectBaseUi.ItemText>
        </SelectBaseUi.Item>
    );
};

const ScrollArrow = (props: { visible: boolean; direction: "up" | "down" }) => {
    const { visible, direction } = props;

    if (!visible) return null;

    const Component = direction === "up" ? SelectBaseUi.ScrollUpArrow : SelectBaseUi.ScrollDownArrow;
    const Icon = direction === "up" ? ChevronUp : ChevronDown;

    return (
        <Component
            className={cn(
                // Layout
                "z-1 flex h-5 w-full items-center justify-center",
                "before:absolute before:left-0 before:h-full before:w-full",
                direction === "up"
                    ? "top-0 data-[side=none]:before:-top-full"
                    : "bottom-0 data-[side=none]:before:-bottom-full",
                // Border
                "rounded-md",
                // Background
                "bg-white",
                // Text
                "cursor-default text-center text-xs before:content-['']",
            )}
        >
            <Icon className="size-5" />
        </Component>
    );
};
