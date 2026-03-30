"use server";

import SendEmailAction from "@actions/send-email";
import EmailTemplate from "@comps/email-template";
import { logActivity } from "@lib/activity";
import { getSession } from "@lib/auth-server";
import { NEXT_PUBLIC_BASE_URL } from "@lib/env";
import { ActivityType } from "@prisma/client/client";

type SecurityEmailType = "password-changed" | "totp-enabled" | "totp-disabled" | "passkey-added" | "passkey-deleted";

const subjects: Record<SecurityEmailType, string> = {
    "password-changed": "Votre mot de passe a été modifié",
    "totp-enabled": "Authentification à deux facteurs activée",
    "totp-disabled": "Authentification à deux facteurs désactivée",
    "passkey-added": "Nouvelle clé d\u2019accès ajoutée",
    "passkey-deleted": "Clé d\u2019accès supprimée",
};

const activityTypes: Record<SecurityEmailType, ActivityType> = {
    "password-changed": "PASSWORD_CHANGED",
    "totp-enabled": "TOTP_ENABLED",
    "totp-disabled": "TOTP_DISABLED",
    "passkey-added": "PASSKEY_ADDED",
    "passkey-deleted": "PASSKEY_DELETED",
};

/**
 * Security notification email + activity logging
 * -> Called from client after sensitive operations (password, TOTP, passkey)
 * -> Recipient is determined server-side via session (not client input)
 * -> Fire-and-forget: does not block the UI
 */
export default async function SendSecurityNotificationAction(emailType: SecurityEmailType) {
    try {
        const session = await getSession();
        if (!session) return;

        void SendEmailAction({
            subject: subjects[emailType],
            email: session.user.email,
            body: EmailTemplate({
                buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
                emailType,
            }),
        });

        void logActivity(session.user.id, activityTypes[emailType]);
    } catch (error) {
        console.error("SendSecurityNotificationAction error:", error);
    }
}
