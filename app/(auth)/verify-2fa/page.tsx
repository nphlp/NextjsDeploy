import Card from "@atoms/card";
import Main from "@core/Main";
import { getSession, isPendingTwoFactor } from "@lib/auth-server";
import { redirect } from "next/navigation";
import VerifyTwoFactorContent from "./_components/verify-two-factor-content";

export default async function Page() {
    const session = await getSession();
    if (session) redirect("/");

    const pendingTwoFactor = await isPendingTwoFactor();
    if (!pendingTwoFactor) redirect("/login");

    return (
        <Main>
            <Card className="max-w-96">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">Vérification en deux étapes</h3>
                    <p className="text-sm text-gray-500">Confirmez votre identité pour continuer.</p>
                </div>
                <VerifyTwoFactorContent />
            </Card>
        </Main>
    );
}
