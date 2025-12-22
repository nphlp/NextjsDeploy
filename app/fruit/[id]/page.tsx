import { Suspense } from "react";
import FruitDetail, { FruitDetailSkeleton } from "./_components/fruit-detail";
import FruitsRecommendations, { FruitsRecommendationsSkeleton } from "./_components/fruits-recommendations";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
    const { params } = props;

    const { id } = await params;

    return (
        <div className="max-w-900px w-full flex-1 space-y-4 px-4 py-4 sm:px-12">
            <Suspense fallback={<FruitDetailSkeleton />}>
                <FruitDetail id={id} />
            </Suspense>
            <Suspense fallback={<FruitsRecommendationsSkeleton />}>
                <FruitsRecommendations fruitIdToExclude={id} />
            </Suspense>
        </div>
    );
}
