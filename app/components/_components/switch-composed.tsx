"use client";

import Switch, { Thumb } from "@atoms/switch";

export default function SwitchComposed() {
    return (
        <label className="flex items-center gap-2 text-sm">
            <Switch>
                <Thumb />
            </Switch>
            Enable notifications
        </label>
    );
}
