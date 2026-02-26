import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import EditionTab from "./_components/edition-tab";
import EmailConfirmModal from "./_components/email-confirm-modal";
import ProfileTab from "./_components/profile-tab";
import ProfileTabs from "./_components/profile-tabs";
import SecurityTab from "./_components/security-tab";

export const metadata: Metadata = {
    title: "Profil",
    description: "Gérez votre profil et vos paramètres de sécurité.",
};

export default async function Page() {
    const session = await getSession();
    if (!session) unauthorized();

    return (
        <Main horizontal="stretch" vertical="start">
            <ProfileTabs
                profilePanel={<ProfileTab serverSession={session} />}
                editionPanel={<EditionTab serverSession={session} />}
                securityPanel={<SecurityTab serverSession={session} />}
            />

            {/* Dialog */}
            <Suspense>
                <EmailConfirmModal serverSession={session} />
            </Suspense>
        </Main>
    );
}
