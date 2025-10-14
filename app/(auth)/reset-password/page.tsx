import Card from "@comps/UI/card";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import RequestResetForm from "./request-reset-form";
import ResetPasswordForm from "./reset-password-form";

type PageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function Page(props: PageProps) {
    const session = await getSession();

    const { searchParams } = props;
    const params = await searchParams;

    const token = params.token;

    if (session) redirect("/");

    return (
        <Card className="max-w-[400px] space-y-4 p-7">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">
                    {token ? "Réinitialiser le mot de passe" : "Mot de passe oublié"}
                </h1>
                <p className="text-gray-middle text-center text-sm">
                    {token
                        ? "Saisissez votre nouveau mot de passe."
                        : "Saisissez votre email de connexion pour recevoir un email de réinitialisation."}
                </p>
            </div>
            {token ? <ResetPasswordForm token={token} /> : <RequestResetForm />}
        </Card>
    );
}
