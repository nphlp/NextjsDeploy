import { getSession } from "@lib/auth-server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "./_components/login-form";

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
        <div className="w-full max-w-[400px] p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">Saisissez vos identifiants de connexion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
};
