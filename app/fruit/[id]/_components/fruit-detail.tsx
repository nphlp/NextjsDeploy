import Link from "@comps/SHADCN/components/link";
import { cn } from "@comps/SHADCN/lib/utils";
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

    // Wait 2 seconds to simulate a slow network or database
    await timeout(2000);

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
                <Link href="/fruits" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                {fruit.name}
            </h1>

            <div className={cn("flex flex-col justify-between gap-2", "rounded-lg border p-5 shadow")}>
                {/* Title */}
                <h2 className="text-xl font-semibold">{fruit.name}</h2>

                {/* Description */}
                {fruit.description && <p>{fruit.description}</p>}

                {/* Présent dans X paniers */}
                {/* <p>
                    Présent dans {fruit.inBasketCount} {fruit.inBasketCount > 1 ? "paniers" : "panier"}
                </p> */}

                {/* Ajouté le xx / xx / xxxx */}
                <p>Ajouté le {formatMediumDate(fruit.createdAt)}</p>

                {/* Par Xxxxx Xxxxxx */}
                <p>
                    Par {fruit.User.name} {fruit.User.lastname}
                </p>
            </div>
        </div>
    );
}

export const FruitDetailSkeleton = () => {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>

            <div className={cn("animate-pulse", "flex flex-col justify-between gap-2", "rounded-lg border p-5 shadow")}>
                {/* Titre */}
                <div className="bg-foreground/5 h-7 w-[100px] flex-none rounded"></div>

                {/* Description */}
                <div className="bg-foreground/5 h-6 w-[340px] flex-none rounded"></div>

                {/* Présent dans X paniers */}
                {/* <div className="bg-foreground/5 h-6 w-[150px] flex-none rounded"></div> */}

                {/* Ajouté le xx / xx / xxxx */}
                <div className="bg-foreground/5 h-6 w-[170px] flex-none rounded"></div>

                {/* Par Xxxxx Xxxxxx */}
                <div className="bg-foreground/5 h-6 w-[110px] flex-none rounded"></div>
            </div>
        </div>
    );
};
