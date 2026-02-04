import Link from "@comps/atoms/button/link";
import Main from "@core/Main";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import BasketCardList, { BasketCardListSkeleton } from "./_components/basket-card-list";

export default async function Page() {
    return (
        <Main horizontal="stretch" vertical="start">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Link label="Fruits" href="/fruits" className="text-2xl font-bold" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                Mes paniers
            </h1>

            <Suspense fallback={<BasketCardListSkeleton />}>
                <BasketCardList />
            </Suspense>
        </Main>
    );
}
