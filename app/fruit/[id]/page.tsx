import Link from "@comps/SHADCN/components/link";
import oRPC from "@lib/orpc";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type GetFruitByIdCachedProps = {
    id: string;
};

const getFruitByIdCached = async (props: GetFruitByIdCachedProps) => {
    "use cache";
    return await oRPC.fruit.findUnique(props);
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;
    const { id } = await params;

    return (
        <div className="w-full max-w-[900px] flex-1 space-y-4 px-4 py-4 sm:px-12">
            <Suspense fallback={<FruitDetailSkeleton />}>
                <FruitDetail id={id} />
            </Suspense>
        </div>
    );
}

type FruitDetailProps = {
    id: string;
};

const FruitDetail = async (props: FruitDetailProps) => {
    "use cache";

    const { id } = props;

    const fruit = await getFruitByIdCached({ id });

    if (!fruit) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <Link
                href="/fruits"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                noStyle
            >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour à la liste
            </Link>

            <h1 className="text-3xl font-bold">{fruit.name}</h1>

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
};

const FruitDetailSkeleton = () => {
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
