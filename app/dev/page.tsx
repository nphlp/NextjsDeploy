import { Link } from "@atoms/button";
import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import { devLinkGroups } from "./_config/links";

export const metadata: Metadata = {
    title: "Index",
    description: "Documentation, guides, and development tools.",
};

export default async function Page() {
    return (
        <Main vertical="start" horizontal="stretch">
            <h1 className="text-3xl font-bold">Docs</h1>
            <p className="text-gray-500">Guides, design references, and API documentation.</p>

            {devLinkGroups.map(({ label, links }) => (
                <section key={label} className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-700">{label}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {links.map(({ label, description, href, icon: Icon }) => (
                            <Link key={label} href={href} label={label} className="group w-full rounded-lg" noStyle>
                                <Card className="h-full transition-colors group-hover:border-gray-400">
                                    <div className="flex items-center gap-3">
                                        <Icon className="size-4 text-gray-500" />
                                        <h3 className="text-lg font-semibold">{label}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">{description}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </Main>
    );
}
