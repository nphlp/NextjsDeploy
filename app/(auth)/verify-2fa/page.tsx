import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import VerifyTwoFactorContent from "./_components/verify-two-factor-content";

export const metadata: Metadata = {
    title: "Vérification 2FA",
    description: "Confirmez votre identité avec la vérification en deux étapes.",
};

export default async function Page() {
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
