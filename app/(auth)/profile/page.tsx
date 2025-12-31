import { Card, CardContent } from "@comps/atoms/card";
import Tabs, { Indicator, List, Panel, Tab } from "@comps/atoms/tabs";
import Main from "@core/Main";
import { getSession } from "@lib/auth-server";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import EditionTab from "./_components/edition-tab";
import EmailConfirmModal from "./_components/email-confirm-modal";
import ProfileTab from "./_components/profile-tab";

export default async function Page() {
    return (
        <Suspense>
            <SuspendedPage />
        </Suspense>
    );
}

const SuspendedPage = async () => {
    "use cache: private";

    const session = await getSession();
    if (!session) unauthorized();

    return (
        <Main className="justify-start">
            <Card className="w-full">
                <CardContent>
                    <Tabs defaultValue="profile" className="w-full">
                        <List className="mb-4">
                            <Tab value="profile">Profil</Tab>
                            <Tab value="edition">Édition</Tab>
                            <Indicator />
                        </List>
                        <Panel value="profile">
                            <ProfileTab session={session} />
                        </Panel>
                        <Panel value="edition">
                            <EditionTab session={session} />
                        </Panel>
                    </Tabs>
                </CardContent>
            </Card>
            <EmailConfirmModal session={session} />
        </Main>
    );
};
