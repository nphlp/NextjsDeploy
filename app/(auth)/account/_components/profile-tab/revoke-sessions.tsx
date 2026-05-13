"use client";

import AlertDialog, { Backdrop, Close, Description, Footer, Header, Popup, Portal, Title } from "@atoms/alert-dialog";
import Button from "@atoms/button";
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
                        <Header>
                            <Title>Déconnexion globale</Title>
                            <Description>Souhaitez-vous vraiment déconnecter toutes vos autres sessions ?</Description>
                        </Header>
                        <Footer>
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
                        </Footer>
                    </Popup>
                </Portal>
            </AlertDialog>
        </>
    );
}
