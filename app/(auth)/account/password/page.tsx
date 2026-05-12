import Main from "@core/main";
import { getCachedSession } from "@lib/auth-server";
import Breadcrumb from "@molecules/breadcrumb";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import { UpdatePasswordForm } from "./_components/update-password-form";

export const metadata: Metadata = {
    title: "Mot de passe",
    description: "Modifier votre mot de passe.",
};

export default async function Page() {
    const session = await getCachedSession();
    if (!session) unauthorized();

    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-6" }}>
            <Breadcrumb items={[{ label: "Account", href: "/account" }]} title="Mot de passe" />
            <div className="mx-auto w-full max-w-xl">
                <UpdatePasswordForm />
            </div>
        </Main>
    );
}
