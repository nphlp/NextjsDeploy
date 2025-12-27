"use client";

import { Menu as MenuBaseUi } from "@base-ui/react/menu";
import { cn } from "@comps/SHADCN/lib/utils";
import { CheckIcon, ChevronDown, ChevronRightIcon, CircleSmallIcon } from "lucide-react";
import { ReactNode } from "react";

type ButtonItem = { type: "button"; label: string; value: string; onItemClick?: (value: string) => void };
type CheckboxItem = {
    type: "checkbox";
    label: string;
    value: string;
    defaultChecked?: boolean;
    checked?: boolean;
    setCheckedChange?: (checked: boolean) => void;
};
type SeparatorItem = { type: "separator" };

// Radio selector requires a group wrapper
type RadioItem = { label: string; value: string };
type RadioGroup = {
    type: "radio-group";
    items: RadioItem[];
    defaultValue?: string;
    selectedRadio?: string;
    setSelectedRadio?: (value: string) => void;
};

// Atomic structure for a menu item
type MenuAtomItem = ButtonItem | CheckboxItem | SeparatorItem | RadioGroup;

// Group or sub-menu that contains any other type of menu items
type Group = { type: "group"; label: string; items: MenuItem[] };
type SubMenuItems = { type: "sub-menu"; label: string; items: MenuItem[] };

// Reccursive type of menu items, groups, sub-menus, etc
export type MenuItem = MenuAtomItem | SubMenuItems | Group;

const exampleItems: MenuItem[] = [
    { type: "button", label: "Play/Pause", value: "play-pause", onItemClick: (value: string) => console.log(value) },
    { type: "separator" },
    {
        type: "group",
        label: "Repeat mode",
        items: [
            { type: "checkbox", label: "Like", value: "like", defaultChecked: true },
            { type: "checkbox", label: "Favorite", value: "favorite" },
        ],
    },
    { type: "separator" },
    {
        type: "group",
        label: "Repeat mode",
        items: [
            {
                type: "radio-group",
                defaultValue: "disabled",
                items: [
                    { label: "Disabled", value: "disabled" },
                    { label: "Random", value: "random" },
                    { label: "One-time", value: "one-time" },
                ],
            },
        ],
    },
    { type: "separator" },
    {
        type: "group",
        label: "Share",
        items: [
            {
                type: "sub-menu",
                label: "Social",
                items: [
                    {
                        type: "button",
                        label: "To Facebook",
                        value: "to-facebook",
                        onItemClick: (value: string) => console.log(value),
                    },
                    {
                        type: "button",
                        label: "To Instagram",
                        value: "to-instagram",
                        onItemClick: (value: string) => console.log(value),
                    },
                    {
                        type: "button",
                        label: "To Twitter",
                        value: "to-twitter",
                        onItemClick: (value: string) => console.log(value),
                    },
                    {
                        type: "sub-menu",
                        label: "More",
                        items: [
                            {
                                type: "button",
                                label: "To Reddit",
                                value: "to-reddit",
                                onItemClick: (value: string) => console.log(value),
                            },
                            {
                                type: "button",
                                label: "To LinkedIn",
                                value: "to-linkedin",
                                onItemClick: (value: string) => console.log(value),
                            },
                        ],
                    },
                ],
            },
            {
                type: "button",
                label: "Copy link",
                value: "copy-link",
                onItemClick: (value: string) => console.log(value),
            },
        ],
    },
];

type MenuProps = {
    /** Menu trigger label */
    label?: string;
    items?: MenuItem[];

    /**
     * Offset distance between the trigger and the popover
     */
    sideOffset?: number;
    /**
     * Display an arrow pointing to the trigger
     */
    popoverWithoutArrow?: boolean;
    /**
     * Open the menu when hovering over the trigger
     */
    openOnHover?: boolean;
};

export default function Menu(props: MenuProps) {
    const {
        label = "Song action",
        items = exampleItems,
        sideOffset = 8,
        popoverWithoutArrow = false,
        openOnHover = false,
    } = props;

    return (
        // This `div` prevents "space-y-*" layout shifting when the menu popup is opened
        // caused BaseUI creates `span` children elements to listen behaviors
        <div>
            <Root>
                <Trigger label={label} openOnHover={openOnHover} />
                <Portal>
                    <Positioner sideOffset={sideOffset}>
                        <Popup>
                            {/* Popup arrow */}
                            {!popoverWithoutArrow && <Arrow />}

                            {/* Popup items */}
                            {items.map((item, index) => Item({ item, index }))}
                        </Popup>
                    </Positioner>
                </Portal>
            </Root>
        </div>
    );
}

// Subcomponents
const { Root, Portal } = MenuBaseUi;

const Trigger = (props: { label: string; openOnHover: boolean }) => {
    const { label, openOnHover } = props;

    return (
        <MenuBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-10 items-center justify-center gap-1.5 px-3.5",
                // Border
                "rounded-md border border-gray-200",
                "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800",
                // Background
                "bg-gray-50 hover:bg-gray-100 active:bg-gray-100 data-popup-open:bg-gray-100",
                // Text
                "text-base font-medium text-gray-900 select-none",
            )}
            openOnHover={openOnHover}
        >
            <span>{label}</span>
            <ChevronDown className="-mr-1 size-4" />
        </MenuBaseUi.Trigger>
    );
};

const Positioner = (props: { children: ReactNode; sideOffset: number }) => {
    const { children, sideOffset } = props;

    return (
        <MenuBaseUi.Positioner className="outline-none" sideOffset={sideOffset}>
            {children}
        </MenuBaseUi.Positioner>
    );
};

const Popup = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <MenuBaseUi.Popup
            className={cn(
                // Layout
                "origin-(--transform-origin) py-1",
                // Border
                "rounded-md outline-1 outline-gray-200",
                "dark:-outline-offset-1 dark:outline-gray-300",
                // Background
                "bg-white",
                // Text
                "text-gray-900",
                // Shadow
                "shadow-lg shadow-gray-200 dark:shadow-none",
                // Animation
                "transition-[transform,scale,opacity]",
                "data-ending-style:scale-90 data-ending-style:opacity-0",
                "data-starting-style:scale-90 data-starting-style:opacity-0",
            )}
        >
            {children}
        </MenuBaseUi.Popup>
    );
};

// Generic item dispatcher
const Item = (props: { item: MenuItem; index: number }) => {
    const { item, index } = props;

    switch (item.type) {
        case "checkbox":
            return <CheckboxItem key={item.value} item={item} />;
        case "radio-group":
            return <RadioGroup key={item.items.map((i) => i.value).join("-")} item={item} />;
        case "separator":
            return <Separator key={index} />;
        case "group":
            return <Group key={index} item={item} />;
        case "sub-menu":
            return <Submenu key={index} item={item} />;
        default:
            return <Button key={item.value} item={item} />;
    }
};

const Separator = () => {
    return <MenuBaseUi.Separator className="mx-4 my-1.5 h-px bg-gray-200" />;
};

// Composant pour les checkboxes
const CheckboxItem = (props: { item: CheckboxItem }) => {
    const { item } = props;

    return (
        <MenuBaseUi.CheckboxItem
            checked={item.checked}
            onCheckedChange={item.setCheckedChange}
            defaultChecked={item.defaultChecked}
            className={cn(
                // Layout
                "grid grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-8 pl-2.5",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
            )}
        >
            <MenuBaseUi.CheckboxItemIndicator className="col-start-1">
                <CheckIcon className="size-4" />
            </MenuBaseUi.CheckboxItemIndicator>
            <span className="col-start-2">{item.label}</span>
        </MenuBaseUi.CheckboxItem>
    );
};

// Composant pour les radio groups
const RadioGroup = (props: { item: RadioGroup }) => {
    const { item } = props;

    return (
        <MenuBaseUi.RadioGroup
            value={item.selectedRadio}
            onValueChange={item.setSelectedRadio}
            defaultValue={item.defaultValue}
        >
            {item.items.map((radioItem) => (
                <RadioItem key={radioItem.value} radioItem={radioItem} />
            ))}
        </MenuBaseUi.RadioGroup>
    );
};

const RadioItem = (props: { radioItem: RadioItem }) => {
    const { radioItem } = props;

    return (
        <MenuBaseUi.RadioItem
            key={radioItem.value}
            value={radioItem.value}
            className={cn(
                "group",
                // Layout
                "grid grid-cols-[1rem_1fr] items-center gap-2 py-2 pr-8 pl-2.5",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
            )}
        >
            {/* Unselected icon (hidden when checked via group) */}
            <CircleSmallIcon className="col-start-1 size-4 group-data-checked:hidden" />

            {/* Selected icon */}
            <MenuBaseUi.RadioItemIndicator className="col-start-1">
                <CircleSmallIcon className="size-4 fill-black group-data-highlighted:fill-gray-50" />
            </MenuBaseUi.RadioItemIndicator>
            <span className="col-start-2">{radioItem.label}</span>
        </MenuBaseUi.RadioItem>
    );
};

// Composant pour les groupes
const Group = (props: { item: Group }) => {
    const { item } = props;

    return (
        <MenuBaseUi.Group>
            <MenuBaseUi.GroupLabel className="cursor-default py-2 pr-8 pl-7.5 text-sm leading-4 text-gray-600 select-none">
                {item.label}
            </MenuBaseUi.GroupLabel>
            {item.items.map((item, index) => Item({ item, index }))}
        </MenuBaseUi.Group>
    );
};

// Offset pour les submenus (défini hors composant pour stabilité)
const getSubmenuOffset = ({ side }: { side: MenuBaseUi.Positioner.Props["side"] }) => {
    return side === "top" || side === "bottom" ? 4 : -4;
};

// Composant pour les submenus
const Submenu = (props: { item: SubMenuItems }) => {
    const { item } = props;

    return (
        <MenuBaseUi.SubmenuRoot>
            <MenuBaseUi.SubmenuTrigger
                className={cn(
                    // Layout
                    "flex items-center justify-between gap-4 py-2 pr-4 pl-4",
                    "data-highlighted:relative data-highlighted:z-0",
                    "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                    "data-popup-open:relative data-popup-open:z-0",
                    "data-popup-open:before:absolute data-popup-open:before:inset-x-1 data-popup-open:before:inset-y-0 data-popup-open:before:z-[-1]",
                    // Border
                    "outline-none",
                    "data-highlighted:before:rounded-sm",
                    "data-popup-open:before:rounded-sm",
                    // Background
                    "data-highlighted:before:bg-gray-900",
                    "data-popup-open:before:bg-gray-100",
                    "data-highlighted:data-popup-open:before:bg-gray-900",
                    // Text
                    "cursor-default text-sm leading-4 select-none",
                    "data-highlighted:text-gray-50",
                )}
            >
                {item.label} <ChevronRightIcon className="size-4" />
            </MenuBaseUi.SubmenuTrigger>

            <MenuBaseUi.Portal>
                <MenuBaseUi.Positioner
                    className="outline-none"
                    sideOffset={getSubmenuOffset}
                    alignOffset={getSubmenuOffset}
                >
                    <MenuBaseUi.Popup
                        className={cn(
                            // Layout
                            "origin-(--transform-origin) py-1",
                            // Border
                            "rounded-md outline-1 outline-gray-200",
                            "dark:-outline-offset-1 dark:outline-gray-300",
                            // Background
                            "bg-white",
                            // Text
                            "text-gray-900",
                            // Shadow
                            "shadow-lg shadow-gray-200 dark:shadow-none",
                            // Animation
                            "transition-[transform,scale,opacity]",
                            "data-ending-style:scale-90 data-ending-style:opacity-0",
                            "data-starting-style:scale-90 data-starting-style:opacity-0",
                        )}
                    >
                        {item.items.map((item, index) => Item({ item, index }))}
                    </MenuBaseUi.Popup>
                </MenuBaseUi.Positioner>
            </MenuBaseUi.Portal>
        </MenuBaseUi.SubmenuRoot>
    );
};

// Composant pour les boutons
const Button = (props: { item: ButtonItem }) => {
    const { item } = props;

    return (
        <MenuBaseUi.Item
            onClick={() => item.onItemClick?.(item.value)}
            className={cn(
                // Layout
                "flex py-2 pr-8 pl-4",
                "data-highlighted:relative data-highlighted:z-0",
                "data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1]",
                // Border
                "outline-none data-highlighted:before:rounded-sm",
                // Background
                "data-highlighted:before:bg-gray-900",
                // Text
                "cursor-default text-sm leading-4 select-none",
                "data-highlighted:text-gray-50",
            )}
        >
            {item.label}
        </MenuBaseUi.Item>
    );
};

const Arrow = () => {
    return (
        <MenuBaseUi.Arrow
            className={cn(
                // Position selon le côté
                "data-[side=bottom]:-top-2",
                "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
                "data-[side=left]:-right-3.25 data-[side=left]:rotate-90",
                "data-[side=right]:-left-3.25 data-[side=right]:-rotate-90",
            )}
        >
            <ArrowSvg />
        </MenuBaseUi.Arrow>
    );
};

const ArrowSvg = (props: React.ComponentProps<"svg">) => {
    return (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
            <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                className="fill-white"
            />
            <path
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                className="fill-gray-200 dark:fill-none"
            />
            <path
                d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                className="dark:fill-gray-300"
            />
        </svg>
    );
};
