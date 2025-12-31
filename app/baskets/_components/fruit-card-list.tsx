"use cache";

import FruitCard, { FruitCardSkeleton } from "./fruit-card";

type FruitCardListProps = {
    items: Array<{
        id: string;
        quantity: number;
        Fruit: {
            id: string;
            name: string;
            description: string | null;
        };
    }>;
};

export default async function FruitCardList(props: FruitCardListProps) {
    const { items } = props;

    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => (
                <FruitCard key={item.id} fruit={item.Fruit} quantity={item.quantity} />
            ))}
        </div>
    );
}

type FruitCardListSkeletonProps = {
    fruitCardCount?: number;
};

export const FruitCardListSkeleton = async (props: FruitCardListSkeletonProps) => {
    const { fruitCardCount = 2 } = props;

    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: fruitCardCount }).map((_, index) => (
                <FruitCardSkeleton key={index} />
            ))}
        </div>
    );
};
