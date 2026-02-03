"use client";

import Card from "@atoms/card";
import { getBrowser, getOs } from "./utils";

type CurrentSessionProps = {
    userAgent: string;
};

export default function CurrentSession(props: CurrentSessionProps) {
    const { userAgent } = props;

    return (
        <Card className="py-4">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                    <div className="min-h-2 min-w-2 rounded-full bg-green-500" />
                    <div className="line-clamp-1">
                        <span className="text-sm font-bold">Current Session</span>
                        <span className="text-muted-foreground text-xs"> • </span>
                        <span className="text-muted-foreground text-xs">{`${getBrowser(userAgent)}, ${getOs(userAgent)}`}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
