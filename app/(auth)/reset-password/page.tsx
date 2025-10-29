import { getSession } from "@lib/authServer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { redirect } from "next/navigation";
import RequestResetForm from "./request-reset-form";
import ResetPasswordForm from "./reset-password-form";

type PageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;
    const params = await searchParams;
    const token = params.token;

    const session = await getSession();
    if (session) redirect("/tasks");

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
}
