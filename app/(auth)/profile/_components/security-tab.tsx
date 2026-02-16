"use client";

import { Separator } from "@base-ui/react/separator";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import PasskeysSection from "./security-tab/passkeys-section";
import TotpSection from "./security-tab/totp-section";

type SecurityTabProps = {
    serverSession: NonNullable<Session>;
};

export default function SecurityTab(props: SecurityTabProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending, refetch } = useSession();

    const session = isPending || !clientSession ? serverSession : clientSession;
    const twoFactorEnabled = session.user.twoFactorEnabled ?? false;

    return (
        <div className="space-y-6">
            <TotpSection twoFactorEnabled={twoFactorEnabled} onStatusChange={refetch} />
            <Separator className="h-px bg-gray-200" />
            <PasskeysSection />
        </div>
    );
}
