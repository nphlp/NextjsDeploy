import Card from "@comps/UI/card";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function Page() {
    const session = await getSession();

    if (session) redirect("/task");

    return (
        <Card className="max-w-[400px] space-y-4 p-7">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">S&apos;inscrire</h1>
                <p className="text-gray-middle w-5/7 text-center text-sm">Saisissez vos informations personnelles.</p>
            </div>
            <RegisterForm />
        </Card>
    );
}
