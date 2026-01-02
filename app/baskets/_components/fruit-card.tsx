"use cache";

import Skeleton, { SkeletonText } from "@atoms/skeleton";
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
            label={fruit.name}
            href={`/fruit/${fruit.id}` as Route}
            className={cn(
                "flex w-full items-center justify-between rounded-md p-3",
                "bg-foreground/2 hover:bg-foreground/5 transition-colors",
            )}
            noStyle
        >
            <div className="flex flex-col">
                <span className="font-medium">{fruit.name}</span>
                <span className="line-clamp-1 text-sm text-gray-600">{fruit.description}</span>
            </div>

            <span className="flex h-7 w-11 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                x{quantity}
            </span>
        </Link>
    );
}

export const FruitCardSkeleton = async () => {
    return (
        <div className={cn("flex items-center justify-between rounded-md p-3", "bg-gray-50")}>
            <div className="flex flex-col">
                <SkeletonText fontSize="md" width="120px" />
                <SkeletonText fontSize="sm" width="280px" />
            </div>

            <Skeleton className="h-7 w-11 rounded-full" />
        </div>
    );
};
