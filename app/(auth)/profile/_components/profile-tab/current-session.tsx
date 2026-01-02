"use client";

import { LocationResponse } from "@app/api/location/route";
import dynamic from "next/dynamic";
import { getBrowser, getOs, locationString } from "./utils";

const LocationMap = dynamic(() => import("./location-map"), { ssr: false });

type CurrentSessionProps = {
    userAgent: string;
    location: LocationResponse | null;
};

export default function CurrentSession(props: CurrentSessionProps) {
    const { userAgent, location } = props;

    return (
        <div className="bg-card space-y-2 rounded-lg border border-gray-200 px-5 py-3">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                    <div className="min-h-2 min-w-2 rounded-full bg-green-500" />
                    <div>
                        <div className="line-clamp-1">
                            <span className="text-sm font-bold">Current Session</span>
                            <span className="text-muted-foreground text-xs"> • </span>
                            <span className="text-muted-foreground text-xs">{`${getBrowser(userAgent)}, ${getOs(userAgent)}`}</span>
                        </div>
                        <div className="text-2xs text-muted-foreground line-clamp-1">{locationString(location)}</div>
                    </div>
                </div>
            </div>
            <LocationMap location={location} />
        </div>
    );
}
