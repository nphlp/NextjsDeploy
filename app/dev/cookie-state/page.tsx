import Main from "@core/Main";
import { getCookieState } from "@lib/cookie-state-server";
import type { Metadata } from "next";
import { Suspense } from "react";
import ButtonDown from "./_components/button-down";
import ButtonUp from "./_components/button-up";
import Counter from "./_components/counter";
import { counterSchema } from "./_lib/cookie-params";

export const metadata: Metadata = {
    title: "Cookie State",
    description: "Demo of cross-component reactive cookie state with SSR hydration.",
};

export default function Page() {
    return (
        <Main vertical="start" horizontal="stretch">
            <h1 className="text-2xl font-bold">Cookie State</h1>
            <p className="text-gray-500">
                Three independent client components sharing the same cookie state, hydrated from the server.
            </p>

            <Suspense>
                <SuspendedContent />
            </Suspense>
        </Main>
    );
}

async function SuspendedContent() {
    const initialState = await getCookieState("demo-counter", counterSchema);

    return (
        <div className="flex items-center gap-6">
            <ButtonDown initialState={initialState} />
            <Counter initialState={initialState} />
            <ButtonUp initialState={initialState} />
        </div>
    );
}
