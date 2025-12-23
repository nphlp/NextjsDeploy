"use client";

import { Menu as MenuBaseUi } from "@base-ui/react/menu";
import { cn } from "@comps/SHADCN/lib/utils";
import { ChevronDown } from "lucide-react";

export type MenuItem = { type: "item"; label: string; value: string } | { type: "separator" };

const exampleItems: MenuItem[] = [
    { type: "item", label: "Add to Library", value: "add-library" },
    { type: "item", label: "Add to Playlist", value: "add-playlist" },
    { type: "separator" },
    { type: "item", label: "Play Next", value: "play-next" },
    { type: "item", label: "Play Last", value: "play-last" },
    { type: "separator" },
    { type: "item", label: "Favorite", value: "favorite" },
    { type: "item", label: "Share", value: "share" },
];

type MenuProps = {
    /** Menu trigger label */
    label?: string;
    items?: MenuItem[];
    onItemClick?: (value: string) => void;
};

// TODO: https://base-ui.com/react/components/menu#examples

export default function Menu(props: MenuProps) {
    const { label = "Song action", items = exampleItems, onItemClick } = props;

    return (
        // This `div` prevents "space-y-*" layout shifting when the menu popup is opened
        // caused BaseUI creates `span` children elements to listen behaviors
        <div>
            <MenuBaseUi.Root>
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
                >
                    <span>{label}</span>
                    <ChevronDown className="-mr-1 size-4" />
                </MenuBaseUi.Trigger>
                <MenuBaseUi.Portal>
                    <MenuBaseUi.Positioner className="outline-none" sideOffset={8}>
                        <MenuBaseUi.Popup
                            className={cn(
                                // Layout
                                "origin-(--transform-origin) py-1",
                                // Border
                                "rounded-md outline-1 outline-gray-200",
                                "dark:-outline-offset-1 dark:outline-gray-300",
                                // Background
                                "bg-[canvas]",
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
                            <MenuBaseUi.Arrow
                                className={cn(
                                    "data-[side=bottom]:-top-2",
                                    "data-[side=left]:-right-3.25 data-[side=left]:rotate-90",
                                    "data-[side=right]:-left-3.25 data-[side=right]:-rotate-90",
                                    "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
                                )}
                            >
                                <ArrowSvg />
                            </MenuBaseUi.Arrow>
                            {items.map((item, index) =>
                                item.type === "separator" ? (
                                    <MenuBaseUi.Separator
                                        key={`sep-${index}`}
                                        className="mx-4 my-1.5 h-px bg-gray-200"
                                    />
                                ) : (
                                    <MenuBaseUi.Item
                                        key={item.value}
                                        onClick={() => onItemClick?.(item.value)}
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
                                ),
                            )}
                        </MenuBaseUi.Popup>
                    </MenuBaseUi.Positioner>
                </MenuBaseUi.Portal>
            </MenuBaseUi.Root>
        </div>
    );
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
    return (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
            <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                className="fill-[canvas]"
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
}
