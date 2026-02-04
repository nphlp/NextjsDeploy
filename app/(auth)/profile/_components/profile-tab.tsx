import { Session } from "@lib/auth-server";
import CurrentSession from "./profile-tab/current-session";
import OtherSessions from "./profile-tab/other-sessions";
import ProfileInfo from "./profile-tab/profile-info";

type ProfileTabProps = {
    serverSession: NonNullable<Session>;
};

export default async function ProfileTab(props: ProfileTabProps) {
    const { serverSession } = props;

    const userAgent = serverSession.session.userAgent ?? "";

    return (
        <div className="space-y-6">
            {/* Informations du profil */}
            <section className="space-y-4">
                <div>
                    <p className="font-medium">Mon profil</p>
                    <p className="text-sm text-gray-600">Consulter et mettre à jour vos informations personnelles.</p>
                </div>
                <ProfileInfo serverSession={serverSession} />
            </section>

            {/* Sessions */}
            <section className="space-y-4">
                <div>
                    <p className="font-medium">Sessions</p>
                    <p className="text-sm text-gray-600">Gérer vos sessions actives.</p>
                </div>
                <div className="space-y-5">
                    <CurrentSession userAgent={userAgent} />
                    <OtherSessions serverSession={serverSession} />
                </div>
            </section>
        </div>
    );
}
