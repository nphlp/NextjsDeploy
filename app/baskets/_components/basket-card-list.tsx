import Link from "@comps/atoms/button/link";
import { getSession } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { timeout } from "@utils/timout";
import { ShoppingBasket } from "lucide-react";
import { redirect } from "next/navigation";
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

export default async function BasketCardList() {
    const session = await getSession();
    if (!session) redirect("/login");

    const baskets = await getBasketsByUserCached({ userId: session.user.id });

    if (baskets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-12 text-center">
                <ShoppingBasket className="text-muted-foreground size-16" strokeWidth={1} />
                <p className="text-muted-foreground">Vous n&apos;avez aucun panier pour le moment.</p>
                <Link label="Découvrir les fruits" href="/fruits" className="text-sm underline underline-offset-4">
                    Découvrir les fruits
                </Link>
            </div>
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
