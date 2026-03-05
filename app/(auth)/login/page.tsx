import Card from "@atoms/card";
import Main from "@core/Main";
import type { Metadata } from "next";
import LoginContent from "./_components/login-content";

export const metadata: Metadata = {
    title: "Connexion",
    description: "Connectez-vous à votre compte.",
};

export default async function Page() {
    return (
        <Main>
            <Card className="max-w-80">
                <LoginContent />
            </Card>
        </Main>
    );
}
