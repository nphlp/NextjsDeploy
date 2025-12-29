"use cache";

import Link from "@comps/atoms/button/link";
import cn from "@lib/cn";
import { Fruit } from "@prisma/client/client";
import { formatMediumDate } from "@utils/date-format";
import { Route } from "next";

type FruitCardProps = {
    fruit: Fruit & { inBasketCount: number };
};

export default async function FruitCard(props: FruitCardProps) {
    const { fruit } = props;

    return (
        <Link
            href={`/fruit/${fruit.id}` as Route}
            className={cn(
                "flex flex-col justify-between gap-2",
                "rounded-lg border p-5 shadow",
                "transition-all hover:scale-101 hover:shadow-lg",
            )}
            noStyle
        >
            {/* Titre */}
            <h2 className="text-lg font-semibold">{fruit.name}</h2>

            {/* Description */}
            {fruit.description && (
                <p className="h-full text-sm text-gray-600 dark:text-gray-400">{fruit.description}</p>
            )}

            {/* Présent dans X paniers */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Présent dans {fruit.inBasketCount} {fruit.inBasketCount > 1 ? "paniers" : "panier"}
            </div>

            {/* Ajouté le xx / xx / xxxx */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                Ajouté le {formatMediumDate(fruit.createdAt)}
            </div>
        </Link>
    );
}

export const FruitCardSkeleton = async () => {
    return (
        <div className={cn("animate-pulse", "flex flex-col justify-between gap-2", "rounded-lg border p-5 shadow")}>
            {/* Titre */}
            <div className="bg-foreground/5 h-7 w-1/2 flex-none rounded"></div>

            {/* Description */}
            <div className="h-full space-y-1">
                <div className="bg-foreground/5 h-[18px] w-full flex-none rounded"></div>
                <div className="bg-foreground/5 h-[18px] w-1/6 flex-none rounded"></div>
            </div>

            {/* Présent dans X paniers */}
            <div className="bg-foreground/5 h-5 w-[150px] flex-none rounded"></div>

            {/* Ajouté le xx / xx / xxxx */}
            <div className="bg-foreground/5 h-4 w-[110px] flex-none rounded"></div>
        </div>
    );
};
