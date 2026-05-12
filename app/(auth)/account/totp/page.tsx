import Main from "@core/main";
import { getCachedSession } from "@lib/auth-server";
import Breadcrumb from "@molecules/breadcrumb";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import TotpForm from "./_components/totp-form";

export const metadata: Metadata = {
    title: "Authentification à deux facteurs",
    description: "Activer ou désactiver l'authentification à deux facteurs (TOTP).",
};

export default async function Page() {
    const session = await getCachedSession();
    if (!session) unauthorized();

    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-6" }}>
            <Breadcrumb items={[{ label: "Account", href: "/account" }]} title="Authentification à deux facteurs" />
            <div className="mx-auto w-full max-w-xl">
                <TotpForm serverSession={session} />
            </div>
        </Main>
    );
}
