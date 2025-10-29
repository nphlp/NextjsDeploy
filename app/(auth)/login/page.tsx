import { getSession } from "@lib/authServer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function Page() {
    const session = await getSession();
    if (session) redirect("/tasks");

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="text-center">Connexion</CardTitle>
                <CardDescription className="text-center">Saisissez vos identifiants de connexion.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
    );
}
