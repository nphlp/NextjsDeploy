import Link from "@comps/SHADCN/components/link";
import oRPC from "@lib/orpc";
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

    if (!fruit) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Link href="/fruits" className="hover:underline" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                {fruit.name}
            </h1>

            {fruit.description && (
                <div className="rounded-lg border p-6 shadow">
                    <h2 className="mb-3 text-lg font-semibold">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300">{fruit.description}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4 shadow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Créé par</div>
                    <div className="mt-1 text-lg">
                        {fruit.User.name}
                        {fruit.User.lastname && ` ${fruit.User.lastname}`}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{fruit.User.email}</div>
                </div>

                <div className="rounded-lg border p-4 shadow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de création</div>
                    <div className="mt-1 text-lg">
                        {new Date(fruit.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const FruitDetailSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-9 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>

            <div className="rounded-lg border p-6 shadow">
                <div className="mb-3 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4 shadow">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="mt-2 h-6 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="mt-2 h-3 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <div className="rounded-lg border p-4 shadow">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="mt-2 h-6 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
            </div>
        </div>
    );
};
