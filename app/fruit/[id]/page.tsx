import Main from "@core/Main";
import oRPC from "@lib/orpc";
import type { Metadata } from "next";
import { Suspense } from "react";
import FruitDetail, { FruitDetailSkeleton } from "./_components/fruit-detail";
import FruitsRecommendations, { FruitsRecommendationsSkeleton } from "./_components/fruits-recommendations";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { id } = await props.params;

    const fruit = await oRPC.fruit.findUnique({ id });

    return {
        title: fruit?.name ?? "Fruit",
        description: fruit ? `Détails et recommandations pour ${fruit.name}.` : "Détails du fruit.",
    };
}

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
