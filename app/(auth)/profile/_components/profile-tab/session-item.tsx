"use client";

import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@comps/atoms/alert-dialog";
import Button from "@comps/atoms/button/button";
import { revokeSession } from "@lib/auth-client";
import { SessionList } from "@lib/auth-server";
import { formatMediumDate, formatTime } from "@utils/date-format";
import { X } from "lucide-react";
import { useState } from "react";
import { useSessionContext } from "./_context/use-context";
import { getBrowser, getOs } from "./utils";

type SessionItemProps = {
    session: SessionList[number];
};

export default function SessionItem(props: SessionItemProps) {
    const { session } = props;
    const { setSessions } = useSessionContext();

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const userAgent = session.userAgent ?? "";
    const formattedDate = formatMediumDate(session.updatedAt);
    const formattedTime = formatTime(session.updatedAt);

    return (
        <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex w-full flex-row items-center gap-3">
                <div className="size-2 rounded-full bg-green-500" />
                <div className="flex w-full flex-row items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{`${getOs(userAgent)}, ${getBrowser(userAgent)}`}</div>
                    <div className="text-right text-gray-500">
                        <div className="text-2xs">Dernière activité le </div>
                        <div className="text-xs text-nowrap">
                            <span className="font-semibold">{formattedDate}</span>
                            <span> à </span>
                            <span className="font-semibold">{formattedTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                label={`Déconnecter la session du ${formattedDate} à ${formattedTime}`}
                colors="outline"
                padding="icon"
                className="size-8"
                onClick={() => setIsAlertOpen(true)}
            >
                <X className="size-4" />
            </Button>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <Portal>
                    <Backdrop />
                    <Popup>
                        <Title className="text-center">Déconnexion</Title>
                        <Description className="flex flex-col items-center gap-4" render={<div />}>
                            <div className="flex flex-row justify-center">
                                <div className="w-fit rounded-lg border border-gray-200 px-7 py-2 text-center">
                                    <div className="text-xs">Dernière activité le</div>
                                    <div className="text-sm font-semibold">
                                        {formattedDate} à {formattedTime}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm">Souhaitez-vous déconnecter cette session ?</div>
                        </Description>
                        <div className="flex justify-end gap-4">
                            <Close>Annuler</Close>
                            <Close
                                className="text-destructive"
                                onClick={() => {
                                    revokeSession({ token: session.token });
                                    setSessions((prev) => prev.filter((item) => item.token !== session.token));
                                }}
                            >
                                Déconnecter
                            </Close>
                        </div>
                    </Popup>
                </Portal>
            </AlertDialog>
        </div>
    );
}
