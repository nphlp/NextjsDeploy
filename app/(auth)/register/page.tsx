import Card from "@atoms/card";
import Main, { MainSuspense } from "@core/Main";
import { getSession } from "@lib/auth-server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import RegisterForm from "./_components/register-form";

export const metadata: Metadata = {
    title: "Inscription",
    description: "Créez votre compte.",
};

export default async function Page() {
    return (
        <Suspense fallback={<MainSuspense />}>
            <SuspendedPage />
        </Suspense>
    );
}

const SuspendedPage = async () => {
    "use cache: private";

    const session = await getSession();
    if (session) redirect("/");

    return (
        <Main>
            <Card className="max-w-80">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">S&apos;inscrire</h3>
                    <p className="text-sm text-gray-500">Saisissez vos informations personnelles.</p>
                </div>
                <RegisterForm />
            </Card>
        </Main>
    );
};
