import { SessionList } from "@lib/auth-server";
import Solid from "@/solid/solid-fetch";
import SessionManager, { SessionAndLocation } from "./session-manager";

type OtherSessionsProps = {
    sessionList: SessionList;
};

export default async function OtherSessions(props: OtherSessionsProps) {
    const { sessionList } = props;

    const orderedSessionList = sessionList.sort(
        (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
    );

    const location = await Promise.all(
        orderedSessionList.map(({ ipAddress }) =>
            Solid({
                route: "/location",
                params: { ipAddress: ipAddress ?? "" },
            }),
        ),
    );

    const sessionAndLocationList: SessionAndLocation[] = orderedSessionList.map((session, index) => ({
        session,
        location: location[index],
    }));

    return <SessionManager sessionAndLocationList={sessionAndLocationList} />;
}
