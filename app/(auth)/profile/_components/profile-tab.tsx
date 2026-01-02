import { Session, getSessionList } from "@lib/auth-server";
import Solid from "@/solid/solid-fetch";
import CurrentSession from "./profile-tab/current-session";
import OtherSessions from "./profile-tab/other-sessions";
import ProfileInfo from "./profile-tab/profile-info";

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
            <section className="space-y-4">
                <div>
                    <p className="font-medium">Mon profil</p>
                    <p className="text-sm text-gray-600">Consulter et mettre à jour vos informations personnelles.</p>
                </div>
                <ProfileInfo session={session} />
            </section>

            {/* Sessions */}
            <section className="space-y-4">
                <div>
                    <p className="font-medium">Sessions</p>
                    <p className="text-sm text-gray-600">Gérer vos sessions actives.</p>
                </div>
                <div className="space-y-5">
                    <CurrentSession userAgent={userAgent} location={currentLocation} />
                    <OtherSessions sessionList={sessionListWithoutCurrentSession} />
                </div>
            </section>
        </div>
    );
}
