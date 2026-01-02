import { Carousel, Slide } from "@atoms/carousel";
import oRPC from "@lib/orpc";
import FruitCard, { FruitCardSkeleton } from "@organisms/fruit-card";
import { timeout } from "@utils/timout";
import { Breakpoint } from "@utils/use-breakpoint";
import { notFound } from "next/navigation";

const slidePerView: Record<Breakpoint, number> = {
    mobile: 1,
    "3xs": 1,
    "2xs": 1,
    xs: 2,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    "2xl": 3,
    "3xl": 3,
};

type GetFruitsRecommendationsCachedProps = {
    excludeIds: string[];
};

const getFruitsRecommendationsCached = async (props: GetFruitsRecommendationsCachedProps) => {
    "use cache";

    // Wait 0.7 second to simulate a slow network or database
    await timeout(700);

    return await oRPC.fruit.findMany(props);
};

type FruitsRecommendationsProps = {
    fruitIdToExclude: string;
};

export default async function FruitsRecommendations(props: FruitsRecommendationsProps) {
    "use cache";

    const { fruitIdToExclude } = props;

    const fruits = await getFruitsRecommendationsCached({ excludeIds: [fruitIdToExclude] });

    if (!fruits) notFound();

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">Recommendations</h2>

            <Carousel slidePerView={slidePerView} withArrows>
                {fruits.map((fruit) => (
                    <Slide key={fruit.id}>
                        <FruitCard fruit={fruit} />
                    </Slide>
                ))}
            </Carousel>
        </div>
    );
}

export const FruitsRecommendationsSkeleton = async () => {
    "use cache";

    const fruits = Array.from({ length: 5 });

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">Recommendations</h2>

            <Carousel slidePerView={slidePerView} withArrows>
                {fruits.map((_, index) => (
                    <Slide key={index}>
                        <FruitCardSkeleton />
                    </Slide>
                ))}
            </Carousel>
        </div>
    );
};
