"use client";

import Collapsible, { Panel, Trigger } from "@atoms/collapsible";
import { ChevronRight } from "lucide-react";

export default function CollapsibleComposed() {
    return (
        <Collapsible>
            <Trigger>
                <ChevronRight className="size-3 transition-all ease-out group-data-panel-open:rotate-90" />
                Show details
            </Trigger>
            <Panel>
                <div className="mt-2 rounded-sm bg-gray-50 px-4 py-2 text-sm">
                    Here are some additional details that were hidden.
                </div>
            </Panel>
        </Collapsible>
    );
}
