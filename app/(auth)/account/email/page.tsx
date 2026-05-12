import Main from "@core/main";
import { getCachedSession } from "@lib/auth-server";
import Breadcrumb from "@molecules/breadcrumb";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import EmailForm from "./_components/email-form";

export const metadata: Metadata = {
    title: "Adresse email",
    description: "Modifier votre adresse email.",
};

export default async function Page() {
    const session = await getCachedSession();
    if (!session) unauthorized();

    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-6" }}>
            <Breadcrumb items={[{ label: "Account", href: "/account" }]} title="Adresse email" />
            <div className="mx-auto w-full max-w-xl">
                <EmailForm serverSession={session} />
            </div>
        </Main>
    );
}
