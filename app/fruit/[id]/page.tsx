import Main from "@core/Main";
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
        <Main horizontal="stretch" vertical="start">
            <Suspense fallback={<FruitDetailSkeleton />}>
                <FruitDetail id={id} />
            </Suspense>

            <Suspense fallback={<FruitsRecommendationsSkeleton />}>
                <FruitsRecommendations fruitIdToExclude={id} />
            </Suspense>
        </Main>
    );
}
