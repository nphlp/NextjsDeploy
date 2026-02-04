"use client";

import { Separator } from "@base-ui/react/separator";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { UpdateFirstnameForm } from "./edition-tab/update-firstname-form";
import { UpdateLastnameForm } from "./edition-tab/update-lastname-form";
import { UpdatePasswordForm } from "./edition-tab/update-password-form";

type EditionTabProps = {
    serverSession: NonNullable<Session>;
};

export default function EditionTab(props: EditionTabProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending, refetch } = useSession();

    // SSR session
    const session = isPending || !clientSession ? serverSession : clientSession;

    return (
        <div className="space-y-6">
            <UpdateLastnameForm session={session} refetch={refetch} />
            <Separator className="h-px bg-gray-200" />
            <UpdateFirstnameForm session={session} refetch={refetch} />
            <Separator className="h-px bg-gray-200" />
            <UpdatePasswordForm />
        </div>
    );
}
