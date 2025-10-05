import Card from "@comps/UI/card";
import LoginForm from "./login-form";

export default function Page() {
    return (
        <Card className="space-y-4 p-7">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">Connexion</h1>
                <p className="text-gray-middle w-5/7 text-center text-sm">Saisissez vos identifiants de connexion.</p>
            </div>
            <LoginForm />
        </Card>
    );
}
