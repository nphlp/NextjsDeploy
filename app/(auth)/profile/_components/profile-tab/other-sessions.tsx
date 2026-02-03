import { SessionList } from "@lib/auth-server";
import SessionManager from "./session-manager";

type OtherSessionsProps = {
    sessionList: SessionList;
};

export default async function OtherSessions(props: OtherSessionsProps) {
    const { sessionList } = props;

    const orderedSessionList = sessionList.sort(
        (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
    );

    return <SessionManager sessionList={orderedSessionList} />;
}
