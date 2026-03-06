"use client";

import Button from "@atoms/button";
import { PanelBottom, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import useDevSidebar from "./use-dev-sidebar";

export default function DevSidebarTrigger() {
    const pathname = usePathname();

    const { toggle } = useDevSidebar();

    if (!pathname.startsWith("/dev")) return null;

    return (
        <Button
            label="Toggle dev sidebar"
            onClick={toggle}
            className="mr-auto rounded-md border-none bg-transparent px-2 hover:bg-gray-100 lg:hidden"
            noStyle
        >
            <PanelBottom className="size-6 sm:hidden" />
            <PanelLeft className="size-6 max-sm:hidden" />
        </Button>
    );
}
