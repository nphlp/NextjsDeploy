"use client";

import { useSession } from "@lib/auth-client";
import type { Session } from "@lib/auth-server";
import TotpSection from "./totp-section";

type TotpFormProps = {
    serverSession: NonNullable<Session>;
};

export default function TotpForm(props: TotpFormProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending, refetch } = useSession();

    const session = isPending || !clientSession ? serverSession : clientSession;
    const twoFactorEnabled = session.user.twoFactorEnabled ?? false;

    return <TotpSection twoFactorEnabled={twoFactorEnabled} email={session.user.email} onStatusChange={refetch} />;
}
