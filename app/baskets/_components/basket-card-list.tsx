import Card from "@atoms/card";
import Link from "@comps/atoms/button/link";
import { Session } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { timeout } from "@utils/timout";
import { ShoppingBasket } from "lucide-react";
import BasketCard, { BasketCardSkeleton } from "./basket-card";

type GetBasketsByUserCachedProps = {
    userId: string;
};

const getBasketsByUserCached = async (props: GetBasketsByUserCachedProps) => {
    "use cache";

    // Wait 1 second to simulate a slow network or database
    await timeout(1000);

    return await oRPC.basket.findManyByUser(props);
};

type BasketCardListProps = {
    session: NonNullable<Session>;
};

export default async function BasketCardList(props: BasketCardListProps) {
    const { session } = props;

    const baskets = await getBasketsByUserCached({ userId: session.user.id });

    if (baskets.length === 0) {
        return (
            <Card className="items-center py-12">
                <ShoppingBasket className="size-16 stroke-[1.2px] text-gray-800" />
                <p className="text-gray-800">Vous n&apos;avez aucun panier pour le moment.</p>
                <Link label="Découvrir les fruits" href="/fruits" padding="sm">
                    Découvrir les fruits
                </Link>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {baskets.map((basket) => (
                <BasketCard key={basket.id} basket={basket} />
            ))}
        </div>
    );
}

type BasketCardListSkeletonProps = {
    fruitCardCountInBasketCard?: number[];
};

export const BasketCardListSkeleton = async (props: BasketCardListSkeletonProps) => {
    "use cache";

    const { fruitCardCountInBasketCard = [5, 3] } = props;

    return (
        <div className="space-y-6">
            {fruitCardCountInBasketCard.map((count, index) => (
                <BasketCardSkeleton key={index} fruitCardCount={count} />
            ))}
        </div>
    );
};
