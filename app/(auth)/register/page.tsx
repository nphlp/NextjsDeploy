import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import RegisterForm from "./_components/register-form";

export const metadata: Metadata = {
    title: "Inscription",
    description: "Créez votre compte.",
};

export default async function Page() {
    return (
        <Main>
            <Card className="max-w-80">
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-semibold">S&apos;inscrire</h1>
                    <p className="text-sm text-gray-500">Saisissez vos informations personnelles.</p>
                </div>
                <RegisterForm />
            </Card>
        </Main>
    );
}
