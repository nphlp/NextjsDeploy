import Main from "@core/Main";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Accueil",
    description: "A ready to deploy application template.",
};

export default async function Page() {
    return (
        <Main>
            <div className="space-y-4">
                <h1 className="text-8xl font-semibold">Nextjs Deploy</h1>
                <h2 className="text-2xl">A ready to deploy application template</h2>
            </div>
        </Main>
    );
}
