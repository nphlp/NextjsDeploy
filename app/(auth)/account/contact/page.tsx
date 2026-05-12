import Main from "@core/main";
import { getCachedSession } from "@lib/auth-server";
import Breadcrumb from "@molecules/breadcrumb";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import ContactForms from "./_components/contact-forms";

export const metadata: Metadata = {
    title: "Mes informations",
    description: "Modifier votre prénom et votre nom.",
};

export default async function Page() {
    const session = await getCachedSession();
    if (!session) unauthorized();

    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-6" }}>
            <Breadcrumb items={[{ label: "Account", href: "/account" }]} title="Mes informations" />
            <div className="mx-auto w-full max-w-xl">
                <ContactForms serverSession={session} />
            </div>
        </Main>
    );
}
