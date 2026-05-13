"use client";

import AlertDialog, { Backdrop, Close, Description, Footer, Header, Popup, Portal, Title } from "@atoms/alert-dialog";
import Button from "@atoms/button";
import { useToast } from "@atoms/toast";
import { authClient, sendVerificationEmail, useSession } from "@lib/auth-client";
import type { Session } from "@lib/auth-server";
import { CircleCheck, CircleX, Clock, Mail } from "lucide-react";
import { useState } from "react";
import ChangeEmailSection from "./change-email-section";

type EmailFormProps = {
    serverSession: NonNullable<Session>;
};

export default function EmailForm(props: EmailFormProps) {
    const { serverSession } = props;
    const { data: clientSession, isPending, refetch } = useSession();

    const session = isPending || !clientSession ? serverSession : clientSession;

    const toast = useToast();
    const isEmailVerified = session.user.emailVerified;
    const pendingEmail = session.user.pendingEmail;

    const [isLoading, setIsLoading] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleResend = async () => {
        setIsLoading(true);
        const { data } = await sendVerificationEmail({ email: session.user.email });
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
        <div className="space-y-6">
            {/* Email actuel */}
            <section className="space-y-2">
                <div>
                    <p className="font-medium">Email actuel</p>
                    <p className="text-sm text-gray-600">Adresse utilisée pour la connexion et les notifications.</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span>{session.user.email}</span>
                        {isEmailVerified ? (
                            <span className="flex items-center gap-1 text-sm text-green-600">
                                <CircleCheck className="size-4" />
                                Vérifié
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-sm text-red-600">
                                <CircleX className="size-4" />
                                Non vérifié
                            </span>
                        )}
                    </div>
                    {!isEmailVerified && (
                        <Button
                            label="Renvoyer"
                            colors="outline"
                            padding="sm"
                            onClick={handleResend}
                            disabled={isLoading}
                        >
                            Renvoyer
                            <Mail className="size-4" />
                        </Button>
                    )}
                </div>
            </section>

            {/* Pending email change */}
            {pendingEmail && (
                <section className="space-y-2">
                    <div>
                        <p className="font-medium">Changement en attente</p>
                        <p className="text-sm text-gray-600">
                            Une demande de changement d&apos;email est en cours. Validez le lien envoyé ou annulez-la.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 stroke-amber-600" />
                            <span className="text-sm">
                                <span className="text-gray-600">En attente :</span>{" "}
                                <span className="font-medium">{pendingEmail}</span>
                            </span>
                        </div>
                        <Button
                            label="Annuler le changement"
                            colors="outline"
                            padding="sm"
                            onClick={() => setIsAlertOpen(true)}
                            disabled={isCanceling}
                        >
                            Annuler
                        </Button>
                    </div>
                </section>
            )}

            <ChangeEmailSection session={session} onStatusChange={refetch} />

            {/* Cancel pending email AlertDialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <Portal>
                    <Backdrop />
                    <Popup>
                        <Header>
                            <Title>Annuler le changement d&apos;email</Title>
                            <Description>
                                Souhaitez-vous annuler la demande de changement d&apos;email vers{" "}
                                <span className="font-medium">{pendingEmail}</span> ? Le lien de vérification envoyé
                                sera invalidé.
                            </Description>
                        </Header>
                        <Footer>
                            <Close>Fermer</Close>
                            <Close className="text-destructive" onClick={handleCancelPendingEmail}>
                                Annuler le changement
                            </Close>
                        </Footer>
                    </Popup>
                </Portal>
            </AlertDialog>
        </div>
    );
}
