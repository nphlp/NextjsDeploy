import { getSession } from "@lib/authServer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function Page() {
    const session = await getSession();
    if (session) redirect("/task");

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="text-center">S&apos;inscrire</CardTitle>
                <CardDescription className="text-center">Saisissez vos informations personnelles.</CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
        </Card>
    );
}
