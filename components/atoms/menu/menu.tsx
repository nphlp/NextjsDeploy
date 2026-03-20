"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
    Arrow,
    CheckboxItem,
    CheckboxItemIndicator,
    Group,
    GroupLabel,
    Item,
    MenuProps,
    Popup,
    Portal,
    Positioner,
    RadioGroup,
    RadioItem,
    RadioItemIndicator,
    Root,
    Separator,
    SubmenuRoot,
    SubmenuTrigger,
    Trigger,
} from "./atoms";

export default function Menu(props: MenuProps) {
    const { children, ...otherProps } = props;

    if (children) return <Root {...otherProps}>{children}</Root>;

    return <MenuDemo />;
}

function MenuDemo() {
    const [sortValue, setSortValue] = useState("date");
    const [showMinimap, setShowMinimap] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <Root>
            <Trigger>
                View <ChevronDown className="-mr-1 size-4" />
            </Trigger>
            <Portal>
                <Positioner>
                    <Popup>
                        <Arrow />

                        <Group>
                            <GroupLabel>Sort</GroupLabel>
                            <RadioGroup value={sortValue} onValueChange={setSortValue}>
                                <RadioItem value="date">
                                    <RadioItemIndicator />
                                    <span className="col-start-2">Date</span>
                                </RadioItem>
                                <RadioItem value="name">
                                    <RadioItemIndicator />
                                    <span className="col-start-2">Name</span>
                                </RadioItem>
                                <RadioItem value="type">
                                    <RadioItemIndicator />
                                    <span className="col-start-2">Type</span>
                                </RadioItem>
                            </RadioGroup>
                        </Group>

                        <Separator />

                        <Group>
                            <GroupLabel>Workspace</GroupLabel>
                            <CheckboxItem checked={showMinimap} onCheckedChange={setShowMinimap}>
                                <CheckboxItemIndicator />
                                <span className="col-start-2">Minimap</span>
                            </CheckboxItem>
                            <CheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                                <CheckboxItemIndicator />
                                <span className="col-start-2">Sidebar</span>
                            </CheckboxItem>
                        </Group>

                        <Separator />

                        <Item>Share</Item>

                        <SubmenuRoot>
                            <SubmenuTrigger>
                                More <ChevronRight className="size-4" />
                            </SubmenuTrigger>
                            <Portal>
                                <Positioner sideOffset={-4} alignOffset={-4}>
                                    <Popup>
                                        <Item>Export</Item>
                                        <Item>Print</Item>
                                        <Item>Settings</Item>
                                    </Popup>
                                </Positioner>
                            </Portal>
                        </SubmenuRoot>
                    </Popup>
                </Positioner>
            </Portal>
        </Root>
    );
}
