import Link from "@comps/SHADCN/components/link";
import { Fruit } from "@prisma/client/client";
import { Route } from "next";

type FruitCardProps = {
    fruit: Fruit;
};

export default async function FruitCard(props: FruitCardProps) {
    "use cache";

    const { fruit } = props;

    return (
        <Link
            href={`/fruit/${fruit.id}` as Route}
            className="block rounded-lg border p-5 shadow transition-all hover:scale-101 hover:shadow-lg"
            noStyle
        >
            <h2 className="text-lg font-semibold">{fruit.name}</h2>
            {fruit.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{fruit.description}</p>}
            <div className="mt-4 text-xs text-gray-500">
                Ajouté le {new Date(fruit.createdAt).toLocaleDateString("fr-FR")}
            </div>
        </Link>
    );
}

export const FruitCardSkeleton = () => {
    return (
        <div className="block animate-pulse rounded-lg border p-5 shadow">
            <div className="bg-foreground/5 h-7 w-3/4 rounded"></div>
            <div className="bg-foreground/5 mt-2 h-5 w-full rounded"></div>
            <div className="bg-foreground/5 mt-1 h-5 w-5/6 rounded"></div>
            <div className="bg-foreground/5 mt-4 h-4 w-1/2 rounded"></div>
        </div>
    );
};
