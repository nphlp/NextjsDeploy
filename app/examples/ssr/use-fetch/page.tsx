import B from "@app/examples/_components/bold";
import I from "@app/examples/_components/italic";
import ProsAndCons from "@app/examples/_components/pros-and-cons";
import oRPC from "@lib/orpc";
import { connection } from "next/server";
import { Suspense } from "react";
import Fruits from "./fruits";

export default async function Page() {
    return (
        <Suspense>
            <SuspendedPage />
        </Suspense>
    );
}

const SuspendedPage = async () => {
    // Prevent prerendering at build time (DB not available during build)
    await connection();

    // Fetch 3 fruits on the server
    const fruits = await oRPC.fruit.findMany({
        take: 3,
    });

    return (
        <div className="w-[600px] flex-1 space-y-5">
            <h1 className="text-2xl font-bold">SSR + useFetch + Toggle</h1>
            <p className="text-muted-foreground text-sm">
                A list of 3 fruits fetched <I>server-side</I>. Server data hydrate initial data of <B>useFetch</B> hook.
            </p>
            <p className="text-muted-foreground text-sm">
                A switch is used to toggle a <B>take value</B> between 3 or 10. When <B>take value</B> changes,{" "}
                <B>useFetch</B> re-fetches fruits <I>client-side</I>.
            </p>
            <ProsAndCons variant="pros">
                <li>SSR support</li>
                <li>Reactive re-fetching with useFetch</li>
            </ProsAndCons>
            <ProsAndCons variant="cons">
                <li>State can not persist through refresh</li>
            </ProsAndCons>
            <Fruits initialFruits={fruits} />
        </div>
    );
};
