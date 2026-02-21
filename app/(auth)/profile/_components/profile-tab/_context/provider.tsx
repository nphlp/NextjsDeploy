"use client";

import { Session, SessionList } from "@lib/auth-server";
import { type ReactNode, useState } from "react";
import { Context } from "./context";

type ProviderProps = {
    serverSession: NonNullable<Session>;
    sessionList: SessionList;
    children: ReactNode;
};

export function Provider(props: ProviderProps) {
    const { serverSession, sessionList, children } = props;

    // Remove current session from the list
    const sessionListWithoutCurrent = sessionList.filter(
        (sessionFromList) => sessionFromList.id !== serverSession.session.id,
    );

    // Order sessions by expiration date (most recent first)
    const orderedSessionList = sessionListWithoutCurrent.sort(
        (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
    );

    const [sessions, setSessions] = useState<SessionList>(orderedSessionList);
    const [isRevokeAllOpen, setIsRevokeAllOpen] = useState(false);

    const value = { sessions, setSessions, isRevokeAllOpen, setIsRevokeAllOpen };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
