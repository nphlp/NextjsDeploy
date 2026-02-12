"use client";

import Card from "@atoms/card";
import { useToast } from "@atoms/toast";
import Button from "@comps/atoms/button/button";
import { SessionClient, sendVerificationEmail, useSession } from "@lib/auth-client";
import { Role } from "@prisma/client/client";
import { CircleCheck, CircleX, Mail } from "lucide-react";
import { useState } from "react";

type ProfileInfoProps = {
    serverSession: NonNullable<SessionClient>;
};

export default function ProfileInfo(props: ProfileInfoProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending } = useSession();

    // SSR session
    const session = isPending || !clientSession ? serverSession : clientSession;

    const toast = useToast();

    const isEmailVerified = session.user.emailVerified;

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

    const formatRole = (role: Role) => {
        switch (role) {
            case "USER":
                return "utilisateur";
            case "ADMIN":
                return "administrateur";
        }
    };

    return (
        <div className="flex w-full items-center justify-between gap-4">
            <Card className="flex-row flex-wrap items-end justify-between">
                <div>
                    {/* Firstname Lastname (role) */}
                    <div className="space-x-1">
                        <span className="text-foreground">{session.user.name}</span>
                        <span className="text-foreground">{session.user.lastname}</span>
                        <span className="font-normal text-gray-500">({formatRole(session.user.role)})</span>
                    </div>

                    {/* Email and verification status */}
                    <div className="line-clamp-1 flex items-center gap-2">
                        {session.user.email}
                        {session.user.emailVerified ? (
                            <CircleCheck className="size-4 stroke-green-500" />
                        ) : (
                            <CircleX className="size-4 stroke-red-400" />
                        )}
                    </div>
                </div>

                {!isEmailVerified && (
                    <Button
                        label="Resend"
                        colors="outline"
                        className="h-fit"
                        onClick={handleResend}
                        disabled={isLoading}
                    >
                        Resend
                        <Mail className="size-4" />
                    </Button>
                )}
            </Card>
        </div>
    );
}
