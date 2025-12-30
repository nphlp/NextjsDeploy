"use cache";

import Card from "@atoms/card";
import { SkeletonText } from "@atoms/skeleton";
import Link from "@comps/atoms/button/link";
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
            label={`View details for ${fruit.name}`}
            href={`/fruit/${fruit.id}` as Route}
            className="size-full"
            noStyle
        >
            <Card className="h-full transition-all hover:scale-101 hover:shadow-lg">
                {/* Titre */}
                <h2 className="text-lg font-semibold">{fruit.name}</h2>

                {/* Description */}
                <div className="flex-1">
                    {fruit.description && <p className="text-sm text-gray-600">{fruit.description}</p>}
                </div>

                {/* Présent dans X paniers */}
                <div className="text-sm text-gray-600">
                    Présent dans {fruit.inBasketCount} {fruit.inBasketCount > 1 ? "paniers" : "panier"}
                </div>

                {/* Ajouté le xx / xx / xxxx */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    Ajouté le {formatMediumDate(fruit.createdAt)}
                </div>
            </Card>
        </Link>
    );
}

export const FruitCardSkeleton = async () => {
    return (
        <Card className="@container h-full">
            {/* Titre */}
            <SkeletonText fontSize="lg" />

            {/* Description */}
            <div className="flex-1">
                <SkeletonText fontSize="sm" width="90%" />
                <SkeletonText fontSize="sm" width="40%" className="@xs:hidden" />
            </div>

            {/* Présent dans X paniers */}
            <SkeletonText fontSize="sm" width="150px" />

            {/* Ajouté le xx / xx / xxxx */}
            <SkeletonText fontSize="xs" width="100px" />
        </Card>
    );
};
