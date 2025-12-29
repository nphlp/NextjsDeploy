import Link from "@comps/atoms/button/link";
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
        <div className="w-full max-w-[900px] flex-1 space-y-4 px-4 py-4 sm:px-12">
            <div className="flex items-center justify-between">
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
        <Link href="/fruit/create" variant="outline" size="sm">
            <Plus className="size-4" />
            Ajouter un fruit
        </Link>
    );
};

const BasketButton = () => {
    return (
        <Link href="/baskets" variant="outline" size="sm">
            <ShoppingBasket className="size-4" />
            Mon panier
        </Link>
    );
};
