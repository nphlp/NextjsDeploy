import Main, { MainSuspense } from "@core/Main";
import { getSession } from "@lib/auth-server";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import EditionTab from "./_components/edition-tab";
import EmailConfirmModal from "./_components/email-confirm-modal";
import ProfileTab from "./_components/profile-tab";
import ProfileTabs from "./_components/profile-tabs";
import SecurityTab from "./_components/security-tab";

export default async function Page() {
    return (
        <Suspense fallback={<MainSuspense />}>
            <SuspendedPage />
        </Suspense>
    );
}

const SuspendedPage = async () => {
    "use cache: private";

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
};
