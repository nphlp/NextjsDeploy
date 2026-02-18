"use client";

import Card from "@atoms/card";
import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@comps/atoms/alert-dialog";
import Button from "@comps/atoms/button/button";
import { revokeOtherSessions, revokeSession } from "@lib/auth-client";
import { SessionList } from "@lib/auth-server";
import { formatMediumDate, formatTime } from "@utils/date-format";
import { X } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { getBrowser, getOs } from "./utils";

type SessionManagerProps = {
    sessionList: SessionList;
};

export default function SessionManager(props: SessionManagerProps) {
    const { sessionList } = props;

    const [data, setData] = useState<SessionList>(sessionList);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    return (
        <div className="space-y-2">
            <div className="flex flex-row items-baseline justify-between">
                <div className="text-lg font-bold">Autres appareils</div>

                {/* Revoke other sessions button */}
                {data.length > 0 && (
                    <Button label="Révoquer les sessions" colors="link" onClick={() => setIsAlertOpen(true)}>
                        Révoquer les sessions
                    </Button>
                )}

                {/* Revoke other sessions dialog */}
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
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
                                        setData([]);
                                    }}
                                >
                                    Déconnecter
                                </Close>
                            </div>
                        </Popup>
                    </Portal>
                </AlertDialog>
            </div>

            {/* Other sessions list */}
            <Card className="py-3">
                {data.length > 0 ? (
                    data.map((session, index) => (
                        <Fragment key={index}>
                            {index !== 0 && <hr className="border-gray-200" />}
                            <SessionItem session={session} setData={setData} />
                        </Fragment>
                    ))
                ) : (
                    <div className="text-center text-sm text-gray-500">Aucune autre session n&apos;est active.</div>
                )}
            </Card>
        </div>
    );
}

type SessionItemProps = {
    session: SessionList[number];
    setData: Dispatch<SetStateAction<SessionList>>;
};

const SessionItem = (props: SessionItemProps) => {
    const { session, setData } = props;

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const userAgent = session.userAgent ?? "";
    const formattedDate = formatMediumDate(session.updatedAt);
    const formattedTime = formatTime(session.updatedAt);

    return (
        <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex w-full flex-row items-center gap-3">
                <div className="size-2 rounded-full bg-green-500" />
                <div className="flex w-full flex-row items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{`${getBrowser(userAgent)} • ${getOs(userAgent)}`}</div>
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

            {/* Revoke this session button */}
            <Button
                label={`Déconnecter la session du ${formattedDate} à ${formattedTime}`}
                colors="outline"
                padding="icon"
                className="size-8"
                onClick={() => setIsAlertOpen(true)}
            >
                <X className="size-4" />
            </Button>

            {/* Revoke this session dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <Portal>
                    <Backdrop />
                    <Popup>
                        <Title className="text-center">Déconnexion</Title>
                        <Description className="flex flex-col items-center gap-4">
                            <div className="flex flex-row justify-center">
                                <div className="w-fit rounded-lg border border-gray-200 px-7 py-2 text-center">
                                    <div className="text-xs">Dernière activité le</div>
                                    <div className="text-sm font-semibold">
                                        {formattedDate} à {formattedTime}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm">Souhaitez-vous vraiment déconnecter cette session ?</div>
                        </Description>
                        <div className="flex justify-end gap-4">
                            <Close>Annuler</Close>
                            <Close
                                className="text-destructive"
                                onClick={() => {
                                    revokeSession({ token: session.token });
                                    setData((prev) => prev.filter((item) => item.token !== session.token));
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
};
