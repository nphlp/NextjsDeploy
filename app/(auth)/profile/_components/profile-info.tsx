"use client";

import { useToast } from "@atoms/toast";
import Button from "@comps/atoms/button/button";
import { SessionClient, sendVerificationEmail, useSession } from "@lib/auth-client";
import { CircleCheck, CircleX, Mail } from "lucide-react";
import { useState } from "react";

type ProfileInfoProps = {
    session: NonNullable<SessionClient>;
};

export default function ProfileInfo(props: ProfileInfoProps) {
    const { session: serverSession } = props;
    const { data: clientSession } = useSession();
    const toast = useToast();

    // SSR session
    const session = clientSession ?? serverSession;

    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async () => {
        setIsLoading(true);

        const { data } = await sendVerificationEmail({
            email: session.user.email,
        });

        if (!data) {
            toast.add({ title: "Erreur", description: "Impossible d'envoyer l'email de vérification.", type: "error" });
            setIsLoading(false);
            return;
        }

        toast.add({ title: "Email envoyé", description: "Vérifiez votre boîte de réception.", type: "success" });
        setIsLoading(false);
    };

    return (
        <div className="flex flex-row items-center gap-5">
            <div className="flex w-full items-center justify-between gap-2">
                <div>
                    <div className="text-md text-foreground font-bold">
                        <span>{session.user.name}</span>
                        <span> </span>
                        <span>{session.user.lastname}</span>
                    </div>
                    <div className="text-muted-foreground line-clamp-1 flex flex-row items-center gap-2 text-sm">
                        <div>{session.user.email}</div>
                        <div>
                            {session.user.emailVerified ? (
                                <CircleCheck className="size-4 stroke-green-500" />
                            ) : (
                                <CircleX className="size-4 stroke-red-400" />
                            )}
                        </div>
                    </div>
                </div>
                {!session.user.emailVerified && (
                    <Button label="Resend" colors="outline" onClick={handleResend} disabled={isLoading}>
                        <span>Resend</span>
                        <Mail className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
