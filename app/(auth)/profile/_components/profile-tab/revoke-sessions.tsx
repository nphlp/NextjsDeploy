"use client";

import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@comps/atoms/alert-dialog";
import Button from "@comps/atoms/button/button";
import { revokeOtherSessions } from "@lib/auth-client";
import { useSessionContext } from "./_context/use-context";

export default function RevokeSessions() {
    const { sessions, setSessions, isRevokeAllOpen, setIsRevokeAllOpen } = useSessionContext();

    if (sessions.length === 0) return null;

    return (
        <>
            <Button
                label="Révoquer les sessions"
                colors="link"
                className="min-h-fit p-0 text-sm text-gray-500"
                onClick={() => setIsRevokeAllOpen(true)}
            >
                Révoquer les sessions
            </Button>

            <AlertDialog open={isRevokeAllOpen} onOpenChange={setIsRevokeAllOpen}>
                <Portal>
                    <Backdrop />
                    <Popup>
                        <Title>Déconnexion globale</Title>
                        <Description>Souhaitez-vous vraiment déconnecter toutes vos autres sessions ?</Description>
                        <div className="flex justify-end gap-4">
                            <Close>Annuler</Close>
                            <Close
                                className="text-destructive"
                                onClick={() => {
                                    revokeOtherSessions();
                                    setSessions([]);
                                }}
                            >
                                Déconnecter
                            </Close>
                        </div>
                    </Popup>
                </Portal>
            </AlertDialog>
        </>
    );
}
