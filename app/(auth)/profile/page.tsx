import { Card, CardContent } from "@comps/atoms/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comps/atoms/tabs";
import { getSession } from "@lib/auth-server";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import EditionTab from "./_components/edition-tab";
import EmailConfirmModal from "./_components/email-confirm-modal";
import ProfileTab from "./_components/profile-tab";
import SessionTab from "./_components/session-tab";

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
        <div className="w-full max-w-[400px] flex-1 p-4">
            <Card className="w-full">
                <CardContent>
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="mb-4 grid w-full grid-cols-3">
                            <TabsTrigger value="profile">Profil</TabsTrigger>
                            <TabsTrigger value="sessions">Sessions</TabsTrigger>
                            <TabsTrigger value="edition">Édition</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="space-y-4">
                            <ProfileTab session={session} />
                        </TabsContent>
                        <TabsContent value="sessions" className="space-y-4">
                            <SessionTab session={session} />
                        </TabsContent>
                        <TabsContent value="edition" className="space-y-4">
                            <EditionTab session={session} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <EmailConfirmModal session={session} />
        </div>
    );
};
