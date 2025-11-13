import B from "@app/examples/_components/bold";
import I from "@app/examples/_components/italic";
import ProsAndCons from "@app/examples/_components/pros-and-cons";
import oRPC from "@lib/orpc";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import Fruits from "./fruits";
import { fruitQueryParamsCached } from "./queryParams";

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
    return (
        <Suspense>
            <SuspendedPage {...props} />
        </Suspense>
    );
}

const SuspendedPage = async (props: PageProps) => {
    // Parse searchParams server-side
    const params = fruitQueryParamsCached.parse(await props.searchParams);
    const { take } = params;

    // Fetch fruits based on the take parameter (3 or 10)
    const fruits = await oRPC.fruit.findMany({
        take,
    });

    return (
        <div className="w-[600px] flex-1 space-y-5">
            <h1 className="text-2xl font-bold">SearchParams SSR + useFetch + useQuery</h1>
            <p className="text-muted-foreground text-sm">
                A list of {take} fruits fetched <I>server-side</I> based on <B>URL search params</B>. Server data
                hydrate initial data of <B>useFetch</B> hook.
            </p>
            <p className="text-muted-foreground text-sm">
                A switch is used to toggle a <B>take value</B> between 3 or 10. When changed, <B>useQueryStates</B>{" "}
                updates the URL and <B>useFetch</B> re-fetches fruits <I>client-side</I>.
            </p>
            <ProsAndCons variant="pros">
                <li>SSR support</li>
                <li>Reactive re-fetching with useFetch</li>
                <li>State persists through refresh via URL</li>
                <li>Shareable URLs with current state</li>
            </ProsAndCons>
            <ProsAndCons variant="cons">
                <li>URL changes visible in browser history</li>
                <li>Slightly more complex setup</li>
            </ProsAndCons>
            <Fruits initialFruits={fruits} />
        </div>
    );
};
