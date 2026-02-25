import { Session, getSessionList } from "@lib/auth-server";
import { Provider } from "./profile-tab/_context/provider";
import CurrentSession from "./profile-tab/current-session";
import ProfileInfo from "./profile-tab/profile-info";
import RevokeSessions from "./profile-tab/revoke-sessions";
import SessionList from "./profile-tab/session-list";

type ProfileTabProps = {
    serverSession: NonNullable<Session>;
};

export default async function ProfileTab(props: ProfileTabProps) {
    const { serverSession } = props;

    const userAgent = serverSession.session.userAgent ?? "";
    const sessionList = await getSessionList();

    return (
        <div className="space-y-6">
            {/* Mon profil */}
            <section className="space-y-4">
                <div>
                    <p className="font-medium">Mon profil</p>
                    <p className="text-sm text-gray-600">Consulter et mettre à jour vos informations personnelles.</p>
                </div>
                <ProfileInfo serverSession={serverSession} />
            </section>

            {/* Session actuelle */}
            <section className="space-y-4">
                <div>
                    <p className="font-medium">Session active</p>
                    <p className="text-sm text-gray-600">Gérer vos sessions actives.</p>
                </div>
                <CurrentSession userAgent={userAgent} />
            </section>

            {/* Autres appareils */}
            <Provider serverSession={serverSession} sessionList={sessionList}>
                <section className="space-y-4">
                    <div className="flex flex-row items-end justify-between">
                        <div>
                            <p className="font-medium">Autres appareils</p>
                            <p className="text-sm text-gray-600">Sessions actives sur vos autres navigateurs.</p>
                        </div>
                        <RevokeSessions />
                    </div>
                    <SessionList />
                </section>
            </Provider>
        </div>
    );
}
