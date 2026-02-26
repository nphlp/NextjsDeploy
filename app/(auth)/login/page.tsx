import Card from "@atoms/card";
import Main from "@core/Main";
import { getSession, isPendingTwoFactor } from "@lib/auth-server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { QueryParamsCachedType, queryParamsCached, queryUrlSerializer } from "../_lib/query-params";
import LoginContent from "./_components/login-content";

export const metadata: Metadata = {
    title: "Connexion",
    description: "Connectez-vous à votre compte.",
};

type PageProps = {
    searchParams: Promise<QueryParamsCachedType>;
};

export default async function Page(props: PageProps) {
    const { redirect: redirectPath } = await queryParamsCached.parse(props.searchParams);

    const session = await getSession();
    if (session) redirect(redirectPath || "/");

    const pendingTwoFactor = await isPendingTwoFactor();
    if (pendingTwoFactor) redirect(queryUrlSerializer("/verify-2fa", { redirect: redirectPath }));

    return (
        <Main>
            <Card className="max-w-80">
                <LoginContent />
            </Card>
        </Main>
    );
}
