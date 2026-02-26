import { queryUrlSerializer } from "@app/(auth)/_lib/query-params";
import { Link } from "@atoms/button";
import Card from "@atoms/card";
import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CreateFruitForm from "./_components/create-fruit-form";

export const metadata: Metadata = {
    title: "Nouveau fruit",
    description: "Ajoutez un nouveau fruit à la liste.",
};

export default async function Page() {
    const session = await getSession();
    if (!session) redirect(queryUrlSerializer("/login", { redirect: "/fruit/create" }));

    return (
        <Main horizontal="stretch" vertical="start">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Link label="Back to fruits" href="/fruits" className="text-2xl font-bold" noStyle>
                    Fruits
                </Link>
                <ChevronRight className="size-4" />
                Créer un fruit
            </h1>

            <div className="flex flex-1 items-center justify-center">
                <Card className="max-w-80">
                    <div className="space-y-2 text-center">
                        <h3 className="text-xl font-semibold">Créer un fruit</h3>
                        <p className="text-sm text-gray-500">Ajoutez un nouveau fruit à la liste.</p>
                    </div>
                    <CreateFruitForm />
                </Card>
            </div>
        </Main>
    );
}
