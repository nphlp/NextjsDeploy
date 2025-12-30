import Card from "@atoms/card";
import { SkeletonText } from "@atoms/skeleton";
import Link from "@comps/atoms/button/link";
import oRPC from "@lib/orpc";
import { formatMediumDate } from "@utils/date-format";
import { timeout } from "@utils/timout";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

type GetFruitByIdCachedProps = {
    id: string;
};

const getFruitByIdCached = async (props: GetFruitByIdCachedProps) => {
    "use cache";

    // Wait 0.5 second to simulate a slow network or database
    await timeout(500);

    return await oRPC.fruit.findUnique(props);
};
type FruitDetailProps = {
    id: string;
};

export default async function FruitDetail(props: FruitDetailProps) {
    "use cache";

    const { id } = props;

    const fruit = await getFruitByIdCached({ id });

    if (!fruit) notFound();

    return (
        <div className="space-y-4">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Link label="Back to fruits" href="/fruits" className="text-2xl font-bold" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                {fruit.name}
            </h1>

            <Card>
                {/* Title */}
                <h2 className="text-xl font-semibold">{fruit.name}</h2>

                {/* Description */}
                {fruit.description && <p className="text-sm text-gray-600">{fruit.description}</p>}

                {/* Présent dans X paniers */}
                <div className="text-sm text-gray-600">
                    Présent dans {fruit.inBasketCount} {fruit.inBasketCount > 1 ? "paniers" : "panier"}
                </div>

                {/* Ajouté le xx / xx / xxxx par Xxxxxx Xxxxxxxxx */}
                <p className="flex items-center justify-between text-xs text-gray-500">
                    Ajouté le {formatMediumDate(fruit.createdAt)}
                </p>
            </Card>
        </div>
    );
}

export const FruitDetailSkeleton = async () => {
    "use cache";

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
