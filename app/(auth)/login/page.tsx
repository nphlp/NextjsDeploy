import { autoRedirectIfLoggedIn } from "@lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import LoginForm from "./login-form";

export default async function Page() {
    await autoRedirectIfLoggedIn();

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
