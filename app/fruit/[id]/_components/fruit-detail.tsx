import Card from "@atoms/card";
import Link from "@comps/atoms/button/link";
import cn from "@lib/cn";
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
                {fruit.description && <p>{fruit.description}</p>}

                {/* Présent dans X paniers */}
                {/* <p>
                    Présent dans {fruit.inBasketCount} {fruit.inBasketCount > 1 ? "paniers" : "panier"}
                </p> */}

                {/* Ajouté le xx / xx / xxxx par Xxxxxx Xxxxxxxxx */}
                <p className="flex items-center justify-between text-xs text-gray-500">
                    Ajouté le {formatMediumDate(fruit.createdAt)} par {fruit.User.name} {fruit.User.lastname}
                </p>
            </Card>
        </div>
    );
}

export const FruitDetailSkeleton = async () => {
    "use cache";

    return (
        <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>

            <div className={cn("animate-pulse", "flex flex-col justify-between gap-2", "rounded-lg border p-5 shadow")}>
                {/* Titre */}
                <div className="bg-foreground/5 h-7 w-25 flex-none rounded"></div>

                {/* Description */}
                <div className="bg-foreground/5 h-6 w-85 flex-none rounded"></div>

                {/* Présent dans X paniers */}
                {/* <div className="bg-foreground/5 h-6 w-[150px] flex-none rounded"></div> */}

                {/* Ajouté le xx / xx / xxxx par Xxxxxx Xxxxxxxxx */}
                <div className="bg-foreground/5 h-6 w-60 flex-none rounded"></div>
            </div>
        </div>
    );
};
