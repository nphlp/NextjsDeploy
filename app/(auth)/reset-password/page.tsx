import Card from "@comps/UI/card";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import ResetForm from "./reset-form";

export default async function Page() {
    const session = await getSession();

    if (session) redirect("/");

    return (
        <Card className="max-w-[400px] space-y-4 p-7">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
                <p className="text-gray-middle text-center text-sm">
                    Saisissez votre email de connexion pour recevoir un email de réinitialisation.
                </p>
            </div>
            <ResetForm />
        </Card>
    );
}
