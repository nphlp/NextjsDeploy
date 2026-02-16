import Card from "@atoms/card";
import Main from "@core/Main";
import { getSession, isPendingTwoFactor } from "@lib/auth-server";
import { redirect } from "next/navigation";
import LoginContent from "./_components/login-content";

export default async function Page() {
    const session = await getSession();
    if (session) redirect("/");

    const pendingTwoFactor = await isPendingTwoFactor();
    if (pendingTwoFactor) redirect("/verify-2fa");

    return (
        <Main>
            <Card className="max-w-80">
                <LoginContent />
            </Card>
        </Main>
    );
}
