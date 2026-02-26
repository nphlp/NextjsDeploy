import Card from "@atoms/card";
import Main from "@core/Main";
import { getSession, isPendingTwoFactor } from "@lib/auth-server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { QueryParamsCachedType, queryParamsCached, queryUrlSerializer } from "../_lib/query-params";
import VerifyTwoFactorContent from "./_components/verify-two-factor-content";

export const metadata: Metadata = {
    title: "Vérification 2FA",
    description: "Confirmez votre identité avec la vérification en deux étapes.",
};

type PageProps = {
    searchParams: Promise<QueryParamsCachedType>;
};

export default async function Page(props: PageProps) {
    const { redirect: redirectPath } = await queryParamsCached.parse(props.searchParams);

    const session = await getSession();
    if (session) redirect(redirectPath || "/");

    const pendingTwoFactor = await isPendingTwoFactor();
    if (!pendingTwoFactor) redirect(queryUrlSerializer("/login", { redirect: redirectPath }));

    return (
        <Main>
            <Card className="max-w-96">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">Vérification en deux étapes</h3>
                    <p className="text-sm text-gray-500">Confirmez votre identité pour continuer.</p>
                </div>
                <VerifyTwoFactorContent />
            </Card>
        </Main>
    );
}
