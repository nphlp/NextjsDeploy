import { getSession } from "@lib/auth-server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import z, { ZodType } from "zod";
import RequestResetForm from "./_components/request-reset-form";
import ResetPasswordForm from "./_components/reset-password-form";

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
        <Suspense>
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
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="text-center">
                    {token ? "Réinitialiser le mot de passe" : "Mot de passe oublié"}
                </CardTitle>
                <CardDescription className="text-center">
                    {token
                        ? "Saisissez votre nouveau mot de passe."
                        : "Saisissez votre email de connexion pour recevoir un email de réinitialisation."}
                </CardDescription>
            </CardHeader>
            <CardContent>{token ? <ResetPasswordForm token={token} /> : <RequestResetForm />}</CardContent>
        </Card>
    );
};
