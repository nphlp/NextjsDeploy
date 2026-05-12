import Main from "@core/main";
import { getCachedSession } from "@lib/auth-server";
import Breadcrumb from "@molecules/breadcrumb";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import PasskeysSection from "./_components/passkeys-section";

export const metadata: Metadata = {
    title: "Clés d'accès",
    description: "Gérer vos clés d'accès (passkeys).",
};

export default async function Page() {
    const session = await getCachedSession();
    if (!session) unauthorized();

    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-6" }}>
            <Breadcrumb items={[{ label: "Account", href: "/account" }]} title="Clés d'accès" />
            <div className="mx-auto w-full max-w-xl">
                <PasskeysSection />
            </div>
        </Main>
    );
}
