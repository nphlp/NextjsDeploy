"use client";

import Link from "@comps/SHADCN/components/link";
import { cn } from "@comps/SHADCN/lib/utils";
import { Badge } from "@comps/SHADCN/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Route } from "next";
import { usePathname } from "next/navigation";
import exampleLinks from "./link";

type NavigationProps = {
    sideBarWidth: number;
};

export default function Navigation(props: NavigationProps) {
    const { sideBarWidth } = props;

    const pathname = usePathname() as Route;

    if (pathname === "/examples") return null;

    const examplesPaths = exampleLinks.flatMap((group) => group.links);

    const pathIndex = examplesPaths.map((link) => link.url).indexOf(pathname);

    const previousPath = pathIndex > 0 ? examplesPaths[pathIndex - 1] : null;
    const nextPath = pathIndex < examplesPaths.length - 1 ? examplesPaths[pathIndex + 1] : null;

    return (
        <div style={{ left: sideBarWidth }} className="fixed right-0 bottom-4 flex justify-center">
            <div className="grid grid-cols-2 gap-4">
                <div className="group relative">
                    {!!previousPath && (
                        <Badge
                            variant="outline"
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2",
                                "right-full translate-x-3 pr-4",
                                "pointer-events-none opacity-0 transition-all duration-150",
                                "group-hover:pr-5 group-hover:opacity-100",
                                "bg-background",
                            )}
                        >
                            {previousPath.shortTitle}
                        </Badge>
                    )}
                    <div className="bg-background relative z-10 rounded-md">
                        <Link href={previousPath?.url ?? "#"} variant="outline" disabled={!previousPath}>
                            <ChevronLeft />
                        </Link>
                    </div>
                </div>
                <div className="group relative">
                    {!!nextPath && (
                        <Badge
                            variant="outline"
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2",
                                "left-full -translate-x-3 pl-4",
                                "pointer-events-none opacity-0 transition-all duration-150",
                                "group-hover:pl-5 group-hover:opacity-100",
                                "bg-background",
                            )}
                        >
                            {nextPath.shortTitle}
                        </Badge>
                    )}
                    <div className="bg-background relative z-10 rounded-md">
                        <Link href={nextPath?.url ?? "#"} variant="outline" disabled={!nextPath}>
                            <ChevronRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
