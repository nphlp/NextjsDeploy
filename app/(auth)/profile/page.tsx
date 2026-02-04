import Tabs, { Indicator, List, Panel, Tab } from "@atoms/tabs";
import Main, { MainSuspense } from "@core/Main";
import { getSession } from "@lib/auth-server";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import EditionTab from "./_components/edition-tab";
import EmailConfirmModal from "./_components/email-confirm-modal";
import ProfileTab from "./_components/profile-tab";

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
            <Tabs defaultValue="profile" className="w-full border-none">
                <List className="px-0 shadow-none">
                    <Tab className="h-auto cursor-pointer px-4 py-1.5" value="profile">
                        Profil
                    </Tab>
                    <Tab className="h-auto cursor-pointer px-4 py-1.5" value="edition">
                        Édition
                    </Tab>
                    <Indicator className="h-8" />
                </List>
                <hr className="mt-2 mb-4 h-px border-gray-200" />
                <Panel value="profile">
                    <ProfileTab serverSession={session} />
                </Panel>
                <Panel value="edition">
                    <EditionTab serverSession={session} />
                </Panel>
            </Tabs>

            {/* Dialog */}
            <Suspense>
                <EmailConfirmModal serverSession={session} />
            </Suspense>
        </Main>
    );
};
