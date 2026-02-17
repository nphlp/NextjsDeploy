"use client";

import Tooltip, { Arrow, Popup, Portal, Positioner, Provider, Trigger } from "@atoms/tooltip";

export default function TooltipComposed() {
    return (
        <Provider>
            <Tooltip>
                <Trigger className="rounded-md border border-gray-200 px-3 py-1.5 text-sm">Hover me</Trigger>
                <Portal>
                    <Positioner>
                        <Popup>
                            <Arrow />
                            Custom tooltip content
                        </Popup>
                    </Positioner>
                </Portal>
            </Tooltip>
        </Provider>
    );
}
