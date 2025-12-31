"use cache";

import Card from "@atoms/card";
import { SkeletonText } from "@atoms/skeleton";
import { formatMediumDate } from "@utils/date-format";
import FruitCardList, { FruitCardListSkeleton } from "./fruit-card-list";

type BasketCardProps = {
    basket: {
        id: string;
        createdAt: Date;
        Quantity: Array<{
            id: string;
            quantity: number;
            Fruit: {
                id: string;
                name: string;
                description: string | null;
            };
        }>;
    };
};

export default async function BasketCard(props: BasketCardProps) {
    const { basket } = props;

    return (
        <Card>
            <div>
                <h2 className="text-lg font-semibold">Panier du {formatMediumDate(basket.createdAt)}</h2>
                <div className="text-sm text-gray-700">
                    {basket.Quantity.length} {basket.Quantity.length > 1 ? "fruits" : "fruit"}
                </div>
            </div>

            <FruitCardList items={basket.Quantity} />
        </Card>
    );
}

type BasketCardSkeletonProps = {
    fruitCardCount?: number;
};

export const BasketCardSkeleton = async (props: BasketCardSkeletonProps) => {
    const { fruitCardCount = 2 } = props;

    return (
        <Card>
            <div>
                <SkeletonText fontSize="lg" width="200px" />
                <SkeletonText fontSize="sm" width="60px" />
            </div>

            <FruitCardListSkeleton fruitCardCount={fruitCardCount} />
        </Card>
    );
};
