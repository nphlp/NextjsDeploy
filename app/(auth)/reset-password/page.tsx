import Card from "@atoms/card";
import Main, { MainSuspense } from "@core/Main";
import { getSession } from "@lib/auth-server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import z, { ZodType } from "zod";
import RequestResetForm from "./_components/request-reset-form";
import ResetPasswordForm from "./_components/reset-password-form";

export const metadata: Metadata = {
    title: "Mot de passe oublié",
    description: "Réinitialisez votre mot de passe.",
};

type Token = {
    token?: string;
};

const paramsSchema: ZodType<Token> = z.object({
    token: z.string().optional(),
});

type PageProps = {
    searchParams: Promise<Token>;
};

export default async function Page(props: PageProps) {
    return (
        <Suspense fallback={<MainSuspense />}>
            <SuspendedPage {...props} />
        </Suspense>
    );
}

const SuspendedPage = async (props: PageProps) => {
    "use cache: private";

    const { token } = paramsSchema.parse(await props.searchParams);

    const session = await getSession();
    if (session) redirect("/");

    return (
        <Main>
            <Card className="max-w-80">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">
                        {token ? "Réinitialiser le mot de passe" : "Mot de passe oublié"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {token
                            ? "Saisissez votre nouveau mot de passe."
                            : "Saisissez votre email de connexion pour recevoir un email de réinitialisation."}
                    </p>
                </div>
                {token ? <ResetPasswordForm token={token} /> : <RequestResetForm />}
            </Card>
        </Main>
    );
};
