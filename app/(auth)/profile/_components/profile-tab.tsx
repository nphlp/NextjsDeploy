import { Session, getSessionList } from "@lib/auth-server";
import Solid from "@/solid/solid-fetch";
import CurrentSession from "./current-session";
import ProfileInfo from "./profile-info";
import SessionManager, { SessionAndLocation } from "./sessionManager";

type ProfileTabProps = {
    session: NonNullable<Session>;
};

export default async function ProfileTab(props: ProfileTabProps) {
    const { session } = props;

    const sessionList = await getSessionList();

    const sessionListWithoutCurrentSession = sessionList.filter(
        (sessionFromList) => sessionFromList.token !== session.session.token,
    );

    const userAgent = session.session.userAgent ?? "";
    const ipAddress = session.session.ipAddress ?? "";
    const currentLocation = await Solid({ route: "/location", params: { ipAddress } });

    return (
        <div className="space-y-6">
            {/* Informations du profil */}
            <section>
                <div className="mb-2">
                    <h2 className="text-lg font-bold">Profil</h2>
                    <p className="text-muted-foreground text-sm">Consulter vos informations personnelles.</p>
                </div>
                <ProfileInfo session={session} />
            </section>

            {/* Sessions */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-bold">Sessions</h2>
                    <p className="text-muted-foreground text-sm">Gérer vos sessions actives.</p>
                </div>
                <div className="space-y-5">
                    <CurrentSession userAgent={userAgent} location={currentLocation} />
                    <OtherSessions sessionList={sessionListWithoutCurrentSession} />
                </div>
            </section>
        </div>
    );
}

type SessionList = Awaited<ReturnType<typeof getSessionList>>;

type OtherSessionsProps = {
    sessionList: SessionList;
};

const OtherSessions = async (props: OtherSessionsProps) => {
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
};
