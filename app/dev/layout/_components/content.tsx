"use client";

import Card from "@atoms/card";
import Switch, { SwitchProps, Thumb } from "@atoms/switch";
import { useState } from "react";

type ContentProps = {
    lorem: string;
};

export default function Content(props: ContentProps) {
    const { lorem } = props;
    const [expanded, setExpanded] = useState(false);

    const text = expanded ? lorem.repeat(10) : lorem;

    return (
        <>
            <label className="flex items-center gap-2">
                <Switch checked={expanded} onCheckedChange={setExpanded as SwitchProps["onCheckedChange"]}>
                    <Thumb />
                </Switch>
                <span className="text-sm font-medium select-none">
                    {expanded ? "Long content (scrollable)" : "Short content (centered)"}
                </span>
            </label>

            <Card>
                <p className="text-sm leading-relaxed text-gray-700">{text}</p>
            </Card>
        </>
    );
}
