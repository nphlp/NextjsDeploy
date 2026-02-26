import Main from "@core/Main";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Colors",
    description: "Color palette and theme tokens.",
};

export default function Page() {
    return (
        <Main horizontal="stretch">
            <section>
                <h2 className="mb-2 text-xl font-bold text-gray-900">Primary Colors</h2>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid h-16 grid-cols-3 text-sm *:flex *:items-center *:justify-center *:px-1">
                        <div className="bg-primary">Primary</div>
                        <div className="bg-primary-hover text-background">Primary</div>
                        <div className="bg-primary-active text-background">Primary</div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="mb-2 text-xl font-bold text-gray-900">Destructive Colors</h2>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid h-16 grid-cols-3 text-sm *:flex *:items-center *:justify-center *:px-1">
                        <div className="bg-destructive">Destructive</div>
                        <div className="bg-destructive-hover text-background">Destructive</div>
                        <div className="bg-destructive-active text-background">Destructive</div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="mb-2 text-xl font-bold text-gray-900">Background & Foreground Colors</h2>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid h-16 grid-cols-2 text-sm *:flex *:items-center *:justify-center *:px-1">
                        <div className="bg-background">Background</div>
                        <div className="bg-foreground text-background">Foreground</div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="mb-2 text-xl font-bold text-gray-900">Gray Scale Colors</h2>
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <div className="grid h-16 grid-cols-11 text-sm *:flex *:items-center *:justify-center *:px-1">
                        <div className="bg-gray-50">50</div>
                        <div className="bg-gray-100">100</div>
                        <div className="bg-gray-200">200</div>
                        <div className="bg-gray-300">300</div>
                        <div className="bg-gray-400">400</div>
                        <div className="bg-gray-500">500</div>
                        <div className="text-background bg-gray-600">600</div>
                        <div className="text-background bg-gray-700">700</div>
                        <div className="text-background bg-gray-800">800</div>
                        <div className="text-background bg-gray-900">900</div>
                        <div className="text-background bg-gray-950">950</div>
                    </div>
                </div>
            </section>
        </Main>
    );
}
