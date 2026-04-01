"use client";

import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@atoms/alert-dialog";
import Button from "@atoms/button";
import Card from "@atoms/card";
import { useToast } from "@atoms/toast";
import { authClient, sendVerificationEmail, useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { Role } from "@prisma/client/client";
import { CircleCheck, CircleX, Clock, Mail } from "lucide-react";
import { useState } from "react";

const formatRole = (role: Role) => {
    switch (role) {
        case "USER":
            return "utilisateur";
        case "ADMIN":
            return "administrateur";
    }
};

type ProfileInfoProps = {
    serverSession: NonNullable<Session>;
};

export default function ProfileInfo(props: ProfileInfoProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending, refetch } = useSession();

    // SSR session
    const session = isPending || !clientSession ? serverSession : clientSession;

    const toast = useToast();

    const isEmailVerified = session.user.emailVerified;
    const pendingEmail = session.user.pendingEmail;

    const [isLoading, setIsLoading] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

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

    const handleCancelPendingEmail = async () => {
        setIsCanceling(true);

        try {
            await authClient.cancelEmailChange();
            toast.add({
                title: "Changement annulé",
                description: "La demande de changement d\u2019email a été annulée.",
                type: "success",
            });
            refetch();
        } catch {
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
        }

        setIsCanceling(false);
    };

    return (
        <div className="flex w-full items-center justify-between gap-4">
            <Card className="flex-row flex-wrap items-end justify-between py-4">
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
                            <>
                                <CircleCheck className="size-4 stroke-green-600" />
                                <span className="text-green-600">Vérifié</span>
                            </>
                        ) : (
                            <>
                                <CircleX className="size-4 stroke-red-600" />
                                <span className="text-red-600">Non vérifié</span>
                            </>
                        )}
                    </div>

                    {/* Pending email change */}
                    {pendingEmail && (
                        <div className="line-clamp-1 flex items-center gap-2">
                            {pendingEmail}
                            <span className="flex items-center gap-1 text-amber-600">
                                <Clock className="inline size-4" />
                                En attente
                            </span>
                            <Button
                                label="Annuler le changement"
                                colors="outline"
                                padding="xs"
                                className="h-fit text-sm"
                                onClick={() => setIsAlertOpen(true)}
                                disabled={isCanceling}
                            >
                                Annuler
                            </Button>
                        </div>
                    )}
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

            {/* Cancel pending email AlertDialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <Portal>
                    <Backdrop />
                    <Popup>
                        <Title>Annuler le changement d&apos;email</Title>
                        <Description>
                            Souhaitez-vous annuler la demande de changement d&apos;email vers{" "}
                            <span className="font-medium">{pendingEmail}</span> ? Le lien de vérification envoyé sera
                            invalidé.
                        </Description>
                        <div className="flex justify-end gap-4">
                            <Close>Fermer</Close>
                            <Close className="text-destructive" onClick={handleCancelPendingEmail}>
                                Annuler le changement
                            </Close>
                        </div>
                    </Popup>
                </Portal>
            </AlertDialog>
        </div>
    );
}
