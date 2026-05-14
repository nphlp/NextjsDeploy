import Main from "@core/main";
import type { Metadata } from "next";
import SortableRawDemo from "./_components/sortable-raw-demo";

export const metadata: Metadata = {
    title: "Sortable | Dev",
    description: "Experimental sandbox for the @atoms/sortable atoms — no DB, mock data only.",
};

export default function Page() {
    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-12" }}>
            <header className="space-y-1">
                <h1 className="text-2xl font-bold">Sortable</h1>
                <p className="text-sm text-gray-600">
                    Experimental sandbox for the <code className="rounded bg-gray-100 px-1">@atoms/sortable</code>{" "}
                    atoms. No DB writes, all state is local.
                </p>
            </header>

            <Section title="1. Raw atoms" subtitle="Bare <Sortable> + <Item> with text labels.">
                <SortableRawDemo />
            </Section>
        </Main>
    );
}

function Section(props: { title: string; subtitle?: string; children: React.ReactNode }) {
    const { title, subtitle, children } = props;
    return (
        <section className="w-full space-y-3">
            <div>
                <h2 className="text-lg font-bold">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}
