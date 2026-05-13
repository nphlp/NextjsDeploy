"use client";

import AlertDialog, { Backdrop, Close, Description, Footer, Header, Popup, Portal, Title } from "@atoms/alert-dialog";
import Button from "@atoms/button";
import { useToast } from "@atoms/toast";
import { authClient } from "@lib/auth-client";
import { Clock } from "lucide-react";
import { useState } from "react";

type PendingEmailRowProps = {
    pendingEmail: string;
    onCancelled: () => void;
};

export default function PendingEmailRow(props: PendingEmailRowProps) {
    const { pendingEmail, onCancelled } = props;
    const toast = useToast();

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const handleCancelPendingEmail = async () => {
        setIsCanceling(true);

        try {
            await authClient.cancelEmailChange();
            toast.add({
                title: "Changement annulé",
                description: "La demande de changement d\u2019email a été annulée.",
                type: "success",
            });
            onCancelled();
        } catch {
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
        }

        setIsCanceling(false);
    };

    return (
        <>
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
        </>
    );
}
