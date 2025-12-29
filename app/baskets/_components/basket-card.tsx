"use cache";

import cn from "@lib/cn";
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
        <div className={cn("rounded-lg border p-5 shadow")}>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Panier du {formatMediumDate(basket.createdAt)}</h2>
                <span className="text-muted-foreground text-sm">
                    {basket.Quantity.length} {basket.Quantity.length > 1 ? "fruits" : "fruit"}
                </span>
            </div>

            <FruitCardList items={basket.Quantity} />
        </div>
    );
}

type BasketCardSkeletonProps = {
    fruitCardCount?: number;
};

export const BasketCardSkeleton = async (props: BasketCardSkeletonProps) => {
    const { fruitCardCount = 2 } = props;

    return (
        <div className={cn("rounded-lg border p-5 shadow")}>
            <div className="mb-4 flex items-center justify-between">
                <div className="bg-foreground/5 h-7 w-[200px] rounded"></div>
                <div className="bg-foreground/5 h-5 w-[60px] rounded"></div>
            </div>

            <FruitCardListSkeleton fruitCardCount={fruitCardCount} />
        </div>
    );
};
