"use client";

import { ChevronRight } from "lucide-react";
import { CollapsibleProps, Panel, Root, Trigger } from "./atoms";

export default function Collapsible(props: CollapsibleProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger>
                <ChevronRight className="size-3 transition-all ease-out group-data-panel-open:rotate-90" />
                Recovery keys
            </Trigger>
            <Panel>
                <div className="mt-1 flex cursor-text flex-col gap-2 rounded-sm bg-gray-100 py-2 pl-7">
                    <div>alien-bean-pasta</div>
                    <div>wild-irish-burrito</div>
                    <div>horse-battery-staple</div>
                </div>
            </Panel>
        </Root>
    );
}
