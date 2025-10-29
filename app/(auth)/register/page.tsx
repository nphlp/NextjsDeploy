import { autoRedirectIfLoggedIn } from "@lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import RegisterForm from "./register-form";

export default async function Page() {
    await autoRedirectIfLoggedIn();

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
