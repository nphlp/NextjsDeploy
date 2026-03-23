import Main from "@core/Main";
import { getCookieState } from "@lib/cookie-state-server";
import type { Metadata } from "next";
import { Suspense } from "react";
import CookieCounter from "./_components/cookie-counter";
import CrossCounterButtons from "./_components/cross-counter-buttons";
import CrossCounterDisplay from "./_components/cross-counter-display";
import QueryCounter from "./_components/query-counter";
import StateCounter from "./_components/state-counter";
import { counterCookieSchema } from "./_lib/cookie-params";

export const metadata: Metadata = {
    title: "State Management",
    description: "Comparison of state management patterns: useState, cookie, cross-component, query params.",
};

function Section(props: { title: string; badge: string; children: React.ReactNode; description: string }) {
    const { title, badge, children, description } = props;

    return (
        <section className="flex flex-col gap-3 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {badge}
                </span>
            </div>
            <p className="text-sm text-gray-500">{description}</p>
            <div className="mt-2">{children}</div>
        </section>
    );
}

export default function Page() {
    return (
        <Main vertical="start" horizontal="stretch">
            <h1 className="text-2xl font-bold">State Management</h1>
            <p className="text-gray-500">Four patterns compared — same counter, different persistence and scope.</p>

            <div className="grid gap-6 lg:grid-cols-2">
                <Section
                    title="useState"
                    badge="Lost on refresh"
                    description="React memory only. Simplest pattern — local to the component, no persistence, no sharing."
                >
                    <StateCounter />
                </Section>

                <Section
                    title="Cookie State"
                    badge="Persists 30 days"
                    description="Stored in document.cookie with SSR hydration via getCookieState. Invisible in URL, survives refresh. Cross-component sync via synthetic events."
                >
                    <Suspense>
                        <SuspendedCookieCounter />
                    </Suspense>
                </Section>

                <Section
                    title="Cross-Component State"
                    badge="Lost on refresh"
                    description="Module-level variable + useSyncExternalStore. Reactive across components without Context or Provider. Two independent components below share the same store."
                >
                    <div className="flex items-center gap-6">
                        <CrossCounterButtons />
                        <div className="flex flex-col items-center gap-1">
                            <CrossCounterDisplay />
                            <span className="text-xs text-gray-400">separate component</span>
                        </div>
                    </div>
                </Section>

                <Section
                    title="Query State"
                    badge="Persists in URL"
                    description="URL search params via nuqs. Bookmarkable, shareable, survives refresh. Watch the URL update as you click."
                >
                    <QueryCounter />
                </Section>
            </div>
        </Main>
    );
}

async function SuspendedCookieCounter() {
    const initialState = await getCookieState("demo-state-cookie", counterCookieSchema);
    return <CookieCounter initialState={initialState} />;
}
