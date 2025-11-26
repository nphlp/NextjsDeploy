"use client";

import Link from "@comps/SHADCN/components/link";
import { cn } from "@comps/SHADCN/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@comps/SHADCN/ui/accordion";
import { ArrowLeft, Notebook } from "lucide-react";
import { usePathname } from "next/navigation";
import { Activity } from "react";
import exampleLinks from "./link";

type SidebarProps = {
    sideBarWidth: number;
};

export default function Sidebar(props: SidebarProps) {
    const { sideBarWidth } = props;

    return (
        <Activity>
            <div style={{ width: sideBarWidth }} className="flex-none" />
            <div
                style={{ width: sideBarWidth }}
                className="fixed h-[calc(100vh-64px)] space-y-6 overflow-auto px-6 pb-28"
            >
                <div className="w-full space-y-2">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <Notebook />
                        <span>Guides</span>
                    </h2>
                    <Link href="/examples" variant="ghost" className="w-full justify-start px-2">
                        <ArrowLeft className="size-5" />
                        <span>Examples</span>
                    </Link>
                </div>
                <AccordionLinks />
            </div>
        </Activity>
    );
}

const AccordionLinks = () => {
    const pathname = usePathname();

    return (
        <Accordion type="multiple" defaultValue={[`item-${exampleLinks[0].name}`]} className="space-y-2">
            {exampleLinks.map((group) => (
                <AccordionItem key={group.name} value={`item-${group.name}`} className="border-none">
                    <AccordionTrigger className="hover:bg-accent cursor-pointer px-3 py-1.5 text-sm hover:no-underline">
                        {group.name}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex">
                            <div className="bg-foreground/15 mx-2 mt-3 mb-1 w-px flex-none rounded-full" />
                            <div className="mt-2 space-y-1">
                                {group.links.map((link) => (
                                    <Link
                                        href={link.url}
                                        key={link.url}
                                        variant="ghost"
                                        className={cn(
                                            "h-fit w-full justify-start px-3 py-1.5 text-xs",
                                            pathname === link.url && "font-bold",
                                        )}
                                    >
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                            {link.shortTitle}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
