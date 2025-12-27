import Link from "@comps/SHADCN/components/link";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import BasketCardList, { BasketCardListSkeleton } from "./_components/basket-card-list";

export default async function Page() {
    return (
        <div className="w-full max-w-225 flex-1 space-y-4 px-4 py-4 sm:px-12">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Link href="/fruits" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                Mes paniers
            </h1>

            <Suspense fallback={<BasketCardListSkeleton />}>
                <BasketCardList />
            </Suspense>
        </div>
    );
}
