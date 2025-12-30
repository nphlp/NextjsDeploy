import Card from "@atoms/card";
import { getSession } from "@lib/auth-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import RegisterForm from "./_components/register-form";

export default async function Page() {
    return (
        <Suspense>
            <SuspendedPage />
        </Suspense>
    );
}

const SuspendedPage = async () => {
    "use cache: private";

    const session = await getSession();
    if (session) redirect("/");

    return (
        <div className="flex w-full justify-center p-7">
            <Card className="max-w-80">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">S&apos;inscrire</h3>
                    <p className="text-sm text-gray-500">Saisissez vos informations personnelles.</p>
                </div>
                <RegisterForm />
            </Card>
        </div>
    );
};
