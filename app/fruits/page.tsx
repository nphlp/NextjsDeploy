import oRPC from "@lib/orpc";
import { Fruit } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

const fruitsCached = unstable_cache(
    async ({ take }: { take?: number }) => {
        return oRPC.fruit.findMany({ take });
    },
    [],
    { revalidate: 300, tags: ["fruits"] },
);

type PageProps = {
    searchParams: Promise<{ take?: string }>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    return (
        <div className="w-full max-w-[900px] flex-1 space-y-4 px-4 py-4 sm:px-12">
            <h1 className="text-2xl font-bold">Liste des fruits</h1>
            <Suspense>
                <FruitsGrid searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

type FruitsGridProps = {
    searchParams: Promise<{ take?: string }>;
};

const FruitsGrid = async (props: FruitsGridProps) => {
    "use cache";

    const { searchParams } = props;

    const { take } = await searchParams;

    const fruits = await fruitsCached({ take: take ? Number(take) : undefined });

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fruits.map((fruit) => (
                <FruitCard key={fruit.id} fruit={fruit} />
            ))}
        </div>
    );
};

type FruitCardProps = {
    fruit: Fruit;
};

const FruitCard = async (props: FruitCardProps) => {
    "use cache";

    const { fruit } = props;

    return (
        <div className="rounded-lg border p-5 shadow">
            <h2 className="text-lg font-semibold">{fruit.name}</h2>
            {fruit.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{fruit.description}</p>}
            <div className="mt-4 text-xs text-gray-500">
                Ajouté le {new Date(fruit.createdAt).toLocaleDateString("fr-FR")}
            </div>
        </div>
    );
};
