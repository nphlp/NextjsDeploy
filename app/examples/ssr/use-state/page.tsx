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

    // Fetch 10 fruits on the server
    const fruits = await oRPC.fruit.findMany({
        take: 10,
    });

    return (
        <div className="w-[600px] flex-1 space-y-5">
            <h1 className="text-2xl font-bold">SSR + useState + Toggle</h1>
            <p className="text-muted-foreground text-sm">
                A list of 10 fruits fetched <I>server-side</I>. Server data hydrate <B>useState</B> client hook.
            </p>
            <p className="text-muted-foreground text-sm">
                A switch is used to toggle between showing 3 or 10 fruits <I>client-side</I>.
            </p>
            <ProsAndCons variant="pros">
                <li>Static data</li>
                <li>No refetching</li>
            </ProsAndCons>
            <ProsAndCons variant="cons">
                <li>Fetching more information that initialy displayed</li>
                <li>State can not persist through refresh</li>
            </ProsAndCons>
            <Fruits initialFruits={fruits} />
        </div>
    );
};
