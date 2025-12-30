"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@comps/atoms/alert-dialog";
import { Session } from "@lib/auth-server";
import { useState } from "react";

type EmailConfirmModalProps = {
    session: NonNullable<Session>;
};

export default function EmailConfirmModal(props: EmailConfirmModalProps) {
    const { session } = props;

    const [isOpen, setIsOpen] = useState(!session.user.emailVerified);

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">Confirmation d&apos;email</AlertDialogTitle>
                    <AlertDialogDescription>
                        Veuillez vérifier votre adresse email pour activer toutes les fonctionnalités de votre compte.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsOpen(false)}>Fermer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
