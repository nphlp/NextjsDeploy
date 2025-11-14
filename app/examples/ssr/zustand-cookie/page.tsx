import B from "@app/examples/_components/bold";
import I from "@app/examples/_components/italic";
import ProsAndCons from "@app/examples/_components/pros-and-cons";
import oRPC from "@lib/orpc";
import { getZustandCookie } from "@lib/zustand-cookie-server";
import { connection } from "next/server";
import { Suspense } from "react";
import Fruits from "./fruits";
import { fruitDisplayCookieName, fruitDisplayCookieSchema } from "./schema";

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

    // Read the cookie on the server side
    const cookie = await getZustandCookie(fruitDisplayCookieName, fruitDisplayCookieSchema);
    const take = cookie?.take ?? 3;

    // Fetch fruits based on the cookie value
    const fruits = await oRPC.fruit.findMany({
        take,
    });

    return (
        <div className="w-[600px] flex-1 space-y-5">
            <h1 className="text-2xl font-bold">SSR + Zustand + Cookie Persistence</h1>
            <p className="text-muted-foreground text-sm">
                A list of {take} fruits fetched <I>server-side</I> based on a <B>cookie value</B>. Server reads the
                cookie to determine initial state.
            </p>
            <p className="text-muted-foreground text-sm">
                A switch is used to toggle a <B>take value</B> between 3 or 10. <B>Zustand store</B> with{" "}
                <B>cookie persistence</B> saves the state and triggers <I>client-side</I> re-fetch with <B>useFetch</B>.
            </p>
            <ProsAndCons variant="pros">
                <li>SSR support</li>
                <li>Reactive re-fetching with useFetch</li>
                <li>State persists through refresh via cookie</li>
                <li>No URL pollution</li>
                <li>Works across all pages</li>
            </ProsAndCons>
            <ProsAndCons variant="cons">
                <li>State not shareable via URL</li>
                <li>Cookie size limitations</li>
                <li>More complex setup with Zustand</li>
            </ProsAndCons>
            <Fruits initialFruits={fruits} />
        </div>
    );
};
