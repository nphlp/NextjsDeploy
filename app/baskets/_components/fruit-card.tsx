"use cache";

import Link from "@comps/atoms/button/link";
import cn from "@lib/cn";
import { Route } from "next";

type FruitCardProps = {
    fruit: {
        id: string;
        name: string;
        description: string | null;
    };
    quantity: number;
};

export default async function FruitCard(props: FruitCardProps) {
    const { fruit, quantity } = props;

    return (
        <Link
            href={`/fruit/${fruit.id}` as Route}
            className={cn(
                "flex items-center justify-between rounded-md p-3",
                "bg-muted/50 hover:bg-muted transition-colors",
            )}
            noStyle
        >
            <div className="flex flex-col">
                <span className="font-medium">{fruit.name}</span>
                <span className="text-muted-foreground line-clamp-1 text-sm">{fruit.description}</span>
            </div>
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">x{quantity}</span>
        </Link>
    );
}

export const FruitCardSkeleton = async () => {
    return (
        <div className={cn("flex items-center justify-between rounded-md p-3", "bg-muted/50")}>
            <div className="flex flex-col gap-1">
                <div className="bg-foreground/5 h-[22px] w-[100px] rounded"></div>
                <div className="bg-foreground/5 h-[18px] w-[200px] rounded"></div>
            </div>
            <div className="bg-foreground/5 h-7 w-10 rounded-full"></div>
        </div>
    );
};
