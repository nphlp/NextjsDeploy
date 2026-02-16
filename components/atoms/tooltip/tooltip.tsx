"use client";

import { Info } from "lucide-react";
import { Arrow, Popup, Portal, Positioner, Provider, Root, TooltipProps, Trigger } from "./atoms";

export default function Tooltip(props: TooltipProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Provider>
            <Root {...otherProps}>
                <Trigger>
                    <Info className="size-4" />
                </Trigger>
                <Portal>
                    <Positioner>
                        <Popup>
                            <Arrow />
                            Tooltip content
                        </Popup>
                    </Positioner>
                </Portal>
            </Root>
        </Provider>
    );
}
