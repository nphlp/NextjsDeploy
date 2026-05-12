import Main from "@core/main";
import { getActivities } from "@lib/activity";
import { getCachedSession, getSessionList } from "@lib/auth-server";
import Breadcrumb from "@molecules/breadcrumb";
import { CircleCheck, CircleX, Clock, FingerprintPattern, KeyRound, Lock, Send, User } from "lucide-react";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import AccountLinkCard from "./_components/account-link-card";
import { Provider } from "./_components/profile-tab/_context/provider";
import ActivityHistory from "./_components/profile-tab/activity-history";
import CurrentSession from "./_components/profile-tab/current-session";
import RevokeSessions from "./_components/profile-tab/revoke-sessions";
import SessionList from "./_components/profile-tab/session-list";

export const metadata: Metadata = {
    title: "Mon compte",
    description: "Consultez et gérez les informations de votre compte.",
};

export default async function Page() {
    const session = await getCachedSession();
    if (!session) unauthorized();

    const userAgent = session.session.userAgent ?? "";
    const [sessionList, activities] = await Promise.all([getSessionList(), getActivities(session.user.id)]);

    const { user } = session;
    const fullName = [user.name, user.lastname].filter(Boolean).join(" ") || "—";
    const roleLabel = user.role !== "USER" ? user.role.toLowerCase() : null;
    const identityPreview = roleLabel ? `${fullName} • ${roleLabel}` : fullName;
    const twoFactorEnabled = user.twoFactorEnabled ?? false;

    return (
        <Main horizontal="stretch" vertical="start" className={{ div: "gap-8" }}>
            <Breadcrumb items={[]} title="Account" />

            {/* Info cards — each links to its dedicated sub-page */}
            <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AccountLinkCard
                    icon={<User className="size-5" />}
                    title="Identité"
                    description="Prénom et nom affichés sur votre profil."
                    href="/account/contact"
                    preview={identityPreview}
                />
                <AccountLinkCard
                    icon={<Send className="size-5" />}
                    title="Adresse email"
                    description="Utilisée pour la connexion et les notifications."
                    href="/account/email"
                    preview={
                        <div className="flex items-center gap-2">
                            <span className="truncate">{user.email}</span>
                            {user.emailVerified ? (
                                <CircleCheck className="size-4 flex-none stroke-green-600" />
                            ) : (
                                <CircleX className="size-4 flex-none stroke-red-600" />
                            )}
                            {user.pendingEmail && <Clock className="size-4 flex-none stroke-amber-600" />}
                        </div>
                    }
                />
                <AccountLinkCard
                    icon={<KeyRound className="size-5" />}
                    title="Mot de passe"
                    description="Changer votre mot de passe de connexion."
                    href="/account/password"
                    preview="••••••••"
                />
                <AccountLinkCard
                    icon={<Lock className="size-5" />}
                    title="Authentification à deux facteurs"
                    description="Sécurisez votre compte avec un second facteur (TOTP)."
                    href="/account/totp"
                    preview={
                        <div className="flex items-center gap-2">
                            {twoFactorEnabled ? (
                                <>
                                    <CircleCheck className="size-4 stroke-green-600" />
                                    <span>Activée</span>
                                </>
                            ) : (
                                <>
                                    <Clock className="size-4 stroke-gray-400" />
                                    <span>Non activée</span>
                                </>
                            )}
                        </div>
                    }
                />
                <AccountLinkCard
                    icon={<FingerprintPattern className="size-5" />}
                    title="Clés d'accès"
                    description="Connexion sans mot de passe via vos appareils."
                    href="/account/passkey"
                    preview="Gérer mes clés d'accès"
                />
            </section>

            {/* Sessions actives */}
            <Provider serverSession={session} sessionList={sessionList}>
                <section className="w-full space-y-4">
                    <div className="flex flex-row items-end justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Sessions actives</h2>
                            <p className="text-sm text-gray-600">
                                Votre session actuelle et celles ouvertes sur vos autres appareils.
                            </p>
                        </div>
                        <RevokeSessions />
                    </div>
                    <CurrentSession userAgent={userAgent} />
                    <SessionList />
                </section>
            </Provider>

            {/* Historique d'activité */}
            <ActivityHistory activities={activities} />
        </Main>
    );
}
