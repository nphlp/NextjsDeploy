import oRPC from "@lib/orpc";
import { timeout } from "@utils/timout";
import { OrderValue, QueryParamsCachedType } from "@/app/fruits/_lib/query-params";
import FruitsGrid from "./fruit-grid";

type GetFruitsCachedProps = {
    searchByName?: string;
    orderByName?: OrderValue;
    take?: number;
};

const getFruitsCached = async (props: GetFruitsCachedProps) => {
    "use cache";

    // Wait 1 second to simulate a slow network or database
    await timeout(1000);

    return await oRPC.fruit.findMany(props);
};

type FruitsGridLoaderProps = QueryParamsCachedType;

export default async function FruitsGridLoader(props: FruitsGridLoaderProps) {
    "use cache";

    const { order, take, search } = props;

    const fruits = await getFruitsCached({
        searchByName: search || undefined,
        orderByName: order,
        take: take ?? undefined,
    });

    return <FruitsGrid initialData={fruits} />;
}
