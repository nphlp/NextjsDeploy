import { Button } from "@comps/SHADCN/ui/button";
import { Card } from "@comps/SHADCN/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import exampleLinks, { LinkGroupType } from "./_components/link";

export default function Page() {
    return (
        <div className="max-w-[1000px] space-y-8 p-7">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold">Examples</h1>
                <p className="text-muted-foreground text-lg">
                    A collection of practical examples demonstrating various features and patterns for this Next.js
                    template.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {exampleLinks.map((group, index) => (
                    <GroupCard key={index} group={group} />
                ))}
            </div>
        </div>
    );
}

type GroupCardProps = {
    group: LinkGroupType;
};

const GroupCard = (props: GroupCardProps) => {
    const { name, longDescription, links } = props.group;
    const firstLink = links[0];

    return (
        <Card className="gap-4 p-6">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground text-sm">{longDescription}</p>
            </div>
            <div className="flex flex-1 flex-col justify-end gap-4">
                <p className="text-muted-foreground text-sm">
                    {links.length} {links.length === 1 ? "guide" : "guides"} available
                </p>
                <Link href={firstLink.url} className="w-full">
                    <Button variant="outline" className="w-full">
                        Start with {firstLink.shortTitle}
                        <ArrowRight className="ml-2 size-4" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
};
