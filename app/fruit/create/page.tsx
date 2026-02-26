import { queryUrlSerializer } from "@app/(auth)/_lib/query-params";
import { Link } from "@atoms/button";
import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FormCard from "./_components/form-card";

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
                <Suspense>
                    <FormCard />
                </Suspense>
            </div>
        </Main>
    );
}
