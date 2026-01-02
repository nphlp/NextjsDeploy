"use client";

import { Separator } from "@base-ui/react/separator";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { UpdateFirstnameForm } from "./edition-tab/update-firstname-form";
import { UpdateLastnameForm } from "./edition-tab/update-lastname-form";
import { UpdatePasswordForm } from "./edition-tab/update-password-form";

type EditionTabProps = {
    session: NonNullable<Session>;
};

export default function EditionTab(props: EditionTabProps) {
    const { session: serverSession } = props;
    const { data: clientSession, refetch } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

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
