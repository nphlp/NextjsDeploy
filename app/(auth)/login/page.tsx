import Card from "@comps/UI/card";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function Page() {
    const session = await getSession();

    if (session) redirect("/task");

    return (
        <Card className="max-w-[400px] space-y-4 p-7">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">Connexion</h1>
                <p className="text-gray-middle w-5/7 text-center text-sm">Saisissez vos identifiants de connexion.</p>
            </div>
            <LoginForm />
        </Card>
    );
}
