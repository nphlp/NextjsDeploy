"use client";

import { Separator } from "@base-ui/react/separator";
import { useSession } from "@lib/auth-client";
import type { Session } from "@lib/auth-server";
import { UpdateFirstnameForm } from "./update-firstname-form";
import { UpdateLastnameForm } from "./update-lastname-form";

type ContactFormsProps = {
    serverSession: NonNullable<Session>;
};

export default function ContactForms(props: ContactFormsProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending, refetch } = useSession();

    const session = isPending || !clientSession ? serverSession : clientSession;

    return (
        <div className="space-y-6">
            <UpdateLastnameForm session={session} refetch={refetch} />
            <Separator className="h-px bg-gray-200" />
            <UpdateFirstnameForm session={session} refetch={refetch} />
        </div>
    );
}
