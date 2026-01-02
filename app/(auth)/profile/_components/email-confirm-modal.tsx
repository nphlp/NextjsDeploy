"use client";

import Button from "@atoms/button";
import AlertDialog, { Backdrop, Description, Popup, Portal, Title } from "@comps/atoms/alert-dialog";
import { useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { useState } from "react";

type EmailConfirmModalProps = {
    session: NonNullable<Session>;
};

export default function EmailConfirmModal(props: EmailConfirmModalProps) {
    const { session: serverSession } = props;
    const { data: clientSession } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

    const [isOpen, setIsOpen] = useState(!session.user.emailVerified);

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Confirmation d&apos;email</Title>
                    <Description>
                        Veuillez vérifier votre adresse email pour activer toutes les fonctionnalités de votre compte.
                    </Description>
                    <div className="flex justify-end gap-4">
                        <Button label="Close button" colors="outline" onClick={() => setIsOpen(false)}>
                            Fermer
                        </Button>
                    </div>
                </Popup>
            </Portal>
        </AlertDialog>
    );
}
