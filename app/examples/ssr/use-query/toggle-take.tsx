"use client";

import { Switch } from "@comps/SHADCN/ui/switch";
import { useTakeQueryParams } from "./queryParamsClientHooks";

export default function ToggleTake() {
    const { take, setTake } = useTakeQueryParams();

    const handleToggle = () => {
        setTake(take === 3 ? 10 : 3);
    };

    return (
        <div className="mt-2 flex items-center gap-2">
            <span className="text-sm">Show 3</span>
            <Switch checked={take === 10} onCheckedChange={handleToggle} />
            <span className="text-sm">Show 10</span>
        </div>
    );
}
