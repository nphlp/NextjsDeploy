import oRPC from "@lib/orpc";
import { timeout } from "@utils/timout";
import FruitCard, { FruitCardSkeleton } from "./fruit-card";

type GetFruitsCachedProps = {
    take?: number;
};

const getFruitsCached = async (props: GetFruitsCachedProps) => {
    "use cache";

    // Wait 2 seconds to simulate a slow network or database
    await timeout(2000);

    return await oRPC.fruit.findMany(props);
};

type FruitsGridProps = {
    take?: string;
};

export default async function FruitsGrid(props: FruitsGridProps) {
    "use cache";

    const { take } = props;

    const fruits = await getFruitsCached({ take: take ? Number(take) : undefined });

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fruits.map((fruit) => (
                <FruitCard key={fruit.id} fruit={fruit} />
            ))}
        </div>
    );
}

export const FruitsGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 11 }).map((_, index) => (
                <FruitCardSkeleton key={index} />
            ))}
        </div>
    );
};
