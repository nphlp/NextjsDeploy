import Main from "@core/Main";
import cn from "@lib/cn";
import { Suspense } from "react";
import AddFruitButton from "./_components/add-fruit-button";
import BasketButton from "./_components/basket-button";
import { FruitsGridSkeleton } from "./_components/fruit-grid";
import FruitsGridLoader from "./_components/fruit-grid-loader";
import SearchFilter from "./_components/search-filter";
import SelectOrder from "./_components/select-order";
import { QueryParamsCachedType, queryParamsCached } from "./_lib/query-params";

type PageProps = {
    searchParams: Promise<QueryParamsCachedType>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;

    const { search, order, take } = await queryParamsCached.parse(searchParams);

    return (
        <Main horizontal="stretch" vertical="start">
            <section className={cn("flex flex-col gap-2", "xs:flex-row xs:items-center xs:justify-between")}>
                <h1 className="text-2xl font-bold">Fruits</h1>
                <div className="flex gap-2">
                    <AddFruitButton />
                    <BasketButton />
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">Order</p>
                    <SelectOrder />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">Search</p>
                    <SearchFilter />
                </div>
            </section>

            <Suspense fallback={<FruitsGridSkeleton />}>
                <FruitsGridLoader order={order} take={take} search={search} />
            </Suspense>
        </Main>
    );
}
