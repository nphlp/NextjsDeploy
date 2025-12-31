import Link from "@comps/atoms/button/link";
import cn from "@lib/cn";
import { Plus, ShoppingBasket } from "lucide-react";
import { Suspense } from "react";
import FruitsGrid, { FruitsGridSkeleton } from "./_components/fruit-grid";

type PageProps = {
    searchParams: Promise<{ take?: string }>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    const { take } = await searchParams;

    return (
        <div className="w-full max-w-225 flex-1 space-y-4 px-4 py-4 sm:px-12">
            <div className={cn("flex flex-col gap-2", "xs:flex-row xs:items-center xs:justify-between")}>
                <h1 className="text-2xl font-bold">Fruits</h1>
                <div className="flex gap-2">
                    <AddFruitButton />
                    <BasketButton />
                </div>
            </div>
            <Suspense fallback={<FruitsGridSkeleton />}>
                <FruitsGrid take={take} />
            </Suspense>
        </div>
    );
}

const AddFruitButton = () => {
    return (
        <Link
            label="Create a fruit"
            href="/fruit/create"
            colors="outline"
            padding="sm"
            className="max-2xs:text-xs max-2xs:py-1"
        >
            <Plus className="size-4 flex-none" />
            Ajouter un fruit
        </Link>
    );
};

const BasketButton = () => {
    return (
        <Link label="My basket" href="/baskets" colors="outline" padding="sm" className="max-2xs:text-xs max-2xs:py-1">
            <ShoppingBasket className="size-4 flex-none" />
            Mon panier
        </Link>
    );
};
