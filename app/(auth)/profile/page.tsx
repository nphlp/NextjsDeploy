import { getSession } from "@lib/auth-server";
import { Card, CardContent } from "@shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/ui/tabs";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import EditionTab from "./components/edition-tab";
import EmailConfirmModal from "./components/email-confirm-modal";
import ProfileTab from "./components/profile-tab";
import SessionTab from "./components/session-tab";

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
        <div className="flex-1 space-y-4 p-7">
            <Card className="w-[600px]">
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
