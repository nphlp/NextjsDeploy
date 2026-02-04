import { Session, getSessionList } from "@lib/auth-server";
import SessionManager from "./session-manager";

type OtherSessionsProps = {
    serverSession: NonNullable<Session>;
};

export default async function OtherSessions(props: OtherSessionsProps) {
    const { serverSession } = props;

    const sessionList = await getSessionList();

    // Remove current session from the list
    const sessionListWithoutCurrent = sessionList.filter(
        (sessionFromList) => sessionFromList.id !== serverSession.session.id,
    );

    // Order sessions by expiration date (most recent first)
    const orderedSessionList = sessionListWithoutCurrent.sort(
        (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
    );

    return <SessionManager sessionList={orderedSessionList} />;
}
