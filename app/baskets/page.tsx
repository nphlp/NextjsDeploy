import { queryUrlSerializer } from "@app/(auth)/_lib/query-params";
import Link from "@comps/atoms/button/link";
import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BasketCardList, { BasketCardListSkeleton } from "./_components/basket-card-list";

export const metadata: Metadata = {
    title: "Paniers",
    description: "Consultez et gérez vos paniers de fruits.",
};

export default async function Page() {
    const session = await getSession();
    if (!session) redirect(queryUrlSerializer("/login", { redirect: "/baskets" }));

    return (
        <Main horizontal="stretch" vertical="start">
            <PageHeader />

            <Suspense fallback={<BasketCardListSkeleton />}>
                <BasketCardList session={session} />
            </Suspense>
        </Main>
    );
}

const PageHeader = async () => {
    return (
        <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Link label="Fruits" href="/fruits" className="text-2xl font-bold" noStyle>
                Fruits
            </Link>
            <ChevronRight className="size-4" />
            Mes paniers
        </h1>
    );
};
