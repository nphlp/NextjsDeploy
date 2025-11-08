"use client";

import { SessionClient, sendVerificationEmail, useSession } from "@lib/auth-client";
import { Button } from "@shadcn/ui/button";
import { CircleCheck, CircleX, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ProfileTabProps = {
    session: NonNullable<SessionClient>;
};

export default function ProfileTab(props: ProfileTabProps) {
    const { session: serverSession } = props;
    const { data: clientSession } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async () => {
        setIsLoading(true);

        const { data } = await sendVerificationEmail({
            email: session.user.email,
        });

        if (!data) {
            toast.error("Erreur lors de l'envoi de l'email de vérification");
            setIsLoading(false);
            return;
        }

        toast.success("Email de vérification envoyé !");
        setIsLoading(false);
    };

    return (
        <div>
            <div className="mb-2">
                <h2 className="text-lg font-bold">Profil</h2>
                <p className="text-muted-foreground text-sm">Consulter vos informations personnelles.</p>
            </div>
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
                        <Button variant="outline" onClick={handleResend} disabled={isLoading} size="sm">
                            <span>Resend</span>
                            <Mail className="size-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
