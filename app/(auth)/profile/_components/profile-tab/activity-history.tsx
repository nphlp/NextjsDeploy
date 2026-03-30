import Card from "@atoms/card";
import Popover, { Arrow, Popup, Portal, Positioner, Trigger } from "@atoms/popover";
import { ACTIVITY_RETENTION_DAYS, Activity } from "@lib/activity";
import { ActivityType } from "@prisma/client/client";
import { formatMediumDate, formatTime } from "@utils/date-format";
import { Fingerprint, Info, KeyRound, LogIn, Mail, ShieldCheck, ShieldOff } from "lucide-react";
import { Fragment } from "react";

const activityLabels: Record<ActivityType, string> = {
    LOGIN: "Connexion",
    EMAIL_CHANGED: "Email modifié",
    PASSWORD_CHANGED: "Mot de passe modifié",
    TOTP_ENABLED: "2FA activé",
    TOTP_DISABLED: "2FA désactivé",
    PASSKEY_ADDED: "Clé d\u2019accès ajoutée",
    PASSKEY_DELETED: "Clé d\u2019accès supprimée",
};

const activityIcons: Record<ActivityType, typeof LogIn> = {
    LOGIN: LogIn,
    EMAIL_CHANGED: Mail,
    PASSWORD_CHANGED: KeyRound,
    TOTP_ENABLED: ShieldCheck,
    TOTP_DISABLED: ShieldOff,
    PASSKEY_ADDED: Fingerprint,
    PASSKEY_DELETED: Fingerprint,
};

type ActivityHistoryProps = {
    activities: Activity[];
};

export default function ActivityHistory(props: ActivityHistoryProps) {
    const { activities } = props;

    return (
        <section className="space-y-4">
            <div className="flex flex-row items-end justify-between">
                <div>
                    <p className="font-medium">Historique d&apos;activité</p>
                    <p className="text-sm text-gray-600">Actions récentes sur votre compte.</p>
                </div>
                <Popover>
                    <Trigger colors="ghost" className="size-8">
                        <Info className="size-4 text-gray-500" />
                    </Trigger>
                    <Portal>
                        <Positioner>
                            <Popup className="max-w-xs text-sm">
                                <Arrow />
                                Ces informations sont conservées pour des raisons de sécurité. Elles sont
                                automatiquement supprimées après {ACTIVITY_RETENTION_DAYS} jours.
                            </Popup>
                        </Positioner>
                    </Portal>
                </Popover>
            </div>

            <Card className="py-4">
                {activities.length > 0 ? (
                    activities.map((activity, index) => {
                        const Icon = activityIcons[activity.type];
                        const label = activityLabels[activity.type];
                        const date = formatMediumDate(activity.createdAt);
                        const time = formatTime(activity.createdAt);

                        return (
                            <Fragment key={activity.id}>
                                {index !== 0 && <hr className="border-gray-200" />}
                                <div className="flex flex-row items-center justify-between gap-4 sm:flex-row">
                                    <div className="flex flex-row items-center gap-3">
                                        <Icon className="size-4 shrink-0 text-gray-500" />
                                        <div>
                                            <div className="text-sm font-semibold">{label}</div>
                                            {activity.metadata && (
                                                <div className="text-2xs text-gray-500">{activity.metadata}</div>
                                            )}
                                            <div className="text-2xs text-gray-500 sm:hidden">
                                                {date} à {time}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden text-right text-gray-500 sm:block">
                                        <div className="text-xs text-nowrap">
                                            <span className="font-semibold">{date}</span>
                                            <span> à </span>
                                            <span className="font-semibold">{time}</span>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })
                ) : (
                    <div className="text-center text-sm text-gray-500">Aucune activité récente.</div>
                )}
            </Card>
        </section>
    );
}
