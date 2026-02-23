import oRPC from "@lib/orpc";
import { timeout } from "@utils/timout";
import { ITEMS_PER_PAGE, OrderValue, QueryParamsCachedType } from "@/app/fruits/_lib/query-params";
import FruitsGrid from "./fruit-grid";

type GetFruitsCachedProps = {
    searchByName?: string;
    orderByName?: OrderValue;
    take?: number;
    skip?: number;
};

const getFruitsCached = async (props: GetFruitsCachedProps) => {
    "use cache";

    // Wait 1 second to simulate a slow network or database
    await timeout(1000);

    return await oRPC.fruit.findMany(props);
};

type GetCountCachedProps = {
    searchByName?: string;
};

const getCountCached = async (props: GetCountCachedProps) => {
    "use cache";
    return await oRPC.fruit.count(props);
};

type FruitsGridLoaderProps = QueryParamsCachedType;

export default async function FruitsGridLoader(props: FruitsGridLoaderProps) {
    "use cache";

    const { order, page, search } = props;

    const [fruits, totalCount] = await Promise.all([
        getFruitsCached({
            searchByName: search || undefined,
            orderByName: order,
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
        }),
        getCountCached({
            searchByName: search || undefined,
        }),
    ]);

    return <FruitsGrid initialData={fruits} initialTotalCount={totalCount} />;
}
