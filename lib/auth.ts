import SendEmailAction from "@actions/send-email";
import { passkey } from "@better-auth/passkey";
import EmailTemplate from "@comps/email-template";
import PrismaInstance from "@lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { captcha, customSession, haveIBeenPwned, magicLink, openAPI, twoFactor } from "better-auth/plugins";
import { nanoid } from "nanoid";
import { logActivity } from "./activity";
import { authBeforeMiddleware } from "./auth-middleware";
import { BETTER_AUTH_SECRET, IS_DEV, IS_TEST, NEXT_PUBLIC_BASE_URL, TURNSTILE_SECRET_KEY } from "./env";

const isRateLimitDisabled = IS_TEST === true;

/**
 * Callback: send reset password link
 */
export const sendResetPassword = async ({ user, url }: { user: { email: string }; url: string }) => {
    void SendEmailAction({
        subject: "Réinitialisez votre mot de passe",
        email: user.email,
        body: EmailTemplate({ buttonUrl: url, emailType: "reset" }),
    });
};

/**
 * Callback: send verification link
 */
export const sendVerificationEmail = async ({ user, url }: { user: { email: string }; url: string }) => {
    void SendEmailAction({
        subject: "Vérifiez votre adresse email",
        email: user.email,
        body: EmailTemplate({ buttonUrl: url, emailType: "verification" }),
    });
};

/**
 * Callback: send magic link
 * -> If user exists: send real magic link
 * -> If user doesn't exist: send "please register" email
 */
export const sendMagicLink = async ({ email, url }: { email: string; url: string }) => {
    const user = await PrismaInstance.user.findUnique({ where: { email } });

    if (user) {
        void SendEmailAction({
            subject: "Votre lien de connexion",
            email,
            body: EmailTemplate({ buttonUrl: url, emailType: "magic-link" }),
        });
    } else {
        void SendEmailAction({
            subject: "Créez votre compte",
            email,
            body: EmailTemplate({ buttonUrl: `${NEXT_PUBLIC_BASE_URL}/register`, emailType: "magic-link-no-account" }),
        });
    }
};

/**
 * Lifecycle: on successful sign-in
 */
const onLogin = async ({ user }: { user: { id: string } }) => {
    void logActivity(user.id, "LOGIN");
};

/**
 * Lifecycle: on password reset (forgot password flow)
 * -> Also verify email if not yet verified
 */
const onPasswordReset = async ({ user }: { user: { id: string } }) => {
    const dbUser = await PrismaInstance.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
    });
    void logActivity(user.id, "PASSWORD_CHANGED");
    void SendEmailAction({
        subject: "Votre mot de passe a été réinitialisé",
        email: dbUser.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "password-changed",
        }),
    });
};

/**
 * Lifecycle: on password change from profile
 */
const onPasswordChanged = async ({ user }: { user: { id: string; email: string } }) => {
    void logActivity(user.id, "PASSWORD_CHANGED");
    void SendEmailAction({
        subject: "Votre mot de passe a été modifié",
        email: user.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "password-changed",
        }),
    });
};

/**
 * Callback: existing user tries to sign up again
 * -> Send email informing them they already have an account (anti-enumeration)
 */
const onExistingUserSignUp = async ({ user }: { user: { email: string } }) => {
    void SendEmailAction({
        subject: "Tentative de création de compte",
        email: user.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/login`,
            emailType: "existing-account",
        }),
    });
};

/**
 * Lifecycle: on email change requested
 */
const onChangeEmailRequested = async ({
    user,
    newEmail,
}: {
    user: { id: string; email: string };
    newEmail: string;
}) => {
    void logActivity(user.id, "EMAIL_CHANGED", `${user.email} → ${newEmail}`);
    void SendEmailAction({
        subject: "Changement d\u2019email en cours",
        email: user.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "change-requested",
        }),
    });
};

/**
 * Lifecycle: on email change completed (verified)
 */
const onChangeEmailCompleted = async ({ oldEmail, newEmail }: { oldEmail: string; newEmail: string }) => {
    void SendEmailAction({
        subject: "Votre adresse email a été modifiée",
        email: oldEmail,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "change-completed",
        }),
    });
    void SendEmailAction({
        subject: "Changement d\u2019email confirmé",
        email: newEmail,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/profile`,
            emailType: "change-success",
        }),
    });
};

/**
 * Lifecycle: on email change cancelled
 */
const onChangeEmailCancelled = async ({ user }: { user: { email: string } }) => {
    void SendEmailAction({
        subject: "Changement d\u2019email annulé",
        email: user.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "change-canceled",
        }),
    });
};

/**
 * Lifecycle: on TOTP enabled
 */
const onTotpEnabled = async ({ user }: { user: { id: string; email: string } }) => {
    void logActivity(user.id, "TOTP_ENABLED");
    void SendEmailAction({
        subject: "Authentification à deux facteurs activée",
        email: user.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "totp-enabled",
        }),
    });
};

/**
 * Lifecycle: on TOTP disabled
 */
const onTotpDisabled = async ({ user }: { user: { id: string; email: string } }) => {
    void logActivity(user.id, "TOTP_DISABLED");
    void SendEmailAction({
        subject: "Authentification à deux facteurs désactivée",
        email: user.email,
        body: EmailTemplate({
            buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
            emailType: "totp-disabled",
        }),
    });
};

/**
 * Lifecycle: on passkey added
 */
const onPasskeyAdded = async ({ userId }: { userId: string }) => {
    void logActivity(userId, "PASSKEY_ADDED");
    const user = await PrismaInstance.user.findUnique({ where: { id: userId } });
    if (user) {
        void SendEmailAction({
            subject: "Nouvelle clé d\u2019accès ajoutée",
            email: user.email,
            body: EmailTemplate({
                buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
                emailType: "passkey-added",
            }),
        });
    }
};

/**
 * Lifecycle: on passkey deleted
 */
const onPasskeyDeleted = async ({ userId }: { userId: string }) => {
    void logActivity(userId, "PASSKEY_DELETED");
    const user = await PrismaInstance.user.findUnique({ where: { id: userId } });
    if (user) {
        void SendEmailAction({
            subject: "Clé d\u2019accès supprimée",
            email: user.email,
            body: EmailTemplate({
                buttonUrl: `${NEXT_PUBLIC_BASE_URL}/contact?subject=security`,
                emailType: "passkey-deleted",
            }),
        });
    }
};

/**
 * Build synthetic user for email enumeration protection.
 * Key order must match the real database output to be indistinguishable.
 */
export const customSyntheticUser = ({
    coreFields,
    additionalFields,
    id,
}: {
    coreFields: Record<string, unknown>;
    additionalFields: Record<string, unknown>;
    id: string;
}) => ({
    ...coreFields,
    pendingEmail: null,
    twoFactorEnabled: false,
    ...additionalFields,
    id,
});

/**
 * Prisma instance with workarounds for Better Auth + Prisma 7 compatibility.
 *
 * 1. Verification.delete — P2025 suppression: Better Auth tries to delete the
 *    Verification record after it's already gone (race condition in passkey/OTP flows).
 *    @see https://github.com/better-auth/better-auth/issues/7129
 *    @see https://github.com/better-auth/better-auth/issues/6267
 *
 * 2. TwoFactor.delete — non-unique where: Better Auth calls delete({ where: { userId } })
 *    but Prisma 7 requires a unique field for delete(). Workaround: findFirst then delete by id.
 *    @see https://github.com/better-auth/better-auth/issues/5929
 *    @todo Remove when upgrading to better-auth 1.5+ (fix merged in PR #7096)
 */
const prismaInstanceWithWorkarounds = PrismaInstance.$extends({
    query: {
        verification: {
            async delete({ args, query }) {
                try {
                    return await query(args);
                } catch (error) {
                    if (error instanceof Error && "code" in error && error.code === "P2025") {
                        return null as never;
                    }
                    throw error;
                }
            },
        },
        twoFactor: {
            async delete({ args, query }) {
                if (!("id" in args.where) || !args.where.id) {
                    const record = await PrismaInstance.twoFactor.findFirst({ where: args.where as never });
                    if (!record) return null as never;
                    args.where = { id: record.id };
                }
                return query(args);
            },
        },
    },
});

type ExtendedSession = Parameters<typeof customSession>[0];

/**
 * Extend session data
 * -> add lastname, role, etc
 */
const extendedSession: ExtendedSession = async (data) => {
    const { user, session } = data;

    const userData = await PrismaInstance.user.findUnique({ where: { id: user.id } });
    if (!userData) throw new Error("User not found");

    // Only expose pendingEmail if it differs from the current email
    const pendingEmail =
        userData.pendingEmail && userData.pendingEmail !== userData.email ? userData.pendingEmail : null;

    const extendedSession = {
        user: {
            ...user,
            lastname: userData.lastname, // Add lastname to session
            role: userData.role, // Add role to session (e.g. "user", "admin", etc)
            pendingEmail, // Pending email change (null if none)
        },
        session,
    };

    return extendedSession;
};

export const auth = betterAuth({
    /**
     * Application name
     */
    appName: "Nextjs Deploy",
    /**
     * Base URL
     * Required to generate correct links
     */
    baseURL: NEXT_PUBLIC_BASE_URL,
    /**
     * Trusted origins for CORS and CSRF protection
     */
    trustedOrigins: [NEXT_PUBLIC_BASE_URL],
    /**
     * Auth secret for signing tokens and encrypting data
     */
    secret: BETTER_AUTH_SECRET,
    onLogin,
    /**
     * Database adapter using Prisma
     */
    database: prismaAdapter(prismaInstanceWithWorkarounds, { provider: "postgresql" }),
    /**
     * Extend user schema with custom fields
     */
    user: {
        changeEmail: {
            enabled: true,
            revokeOtherSessions: true,
            onChangeEmailRequested,
            onChangeEmailCompleted,
            onChangeEmailCancelled,
        },
        additionalFields: {
            lastname: {
                type: "string",
                required: true,
            },
        },
    },
    /**
     * Reset password
     */
    emailAndPassword: {
        enabled: true, // Enable email/password auth
        requireEmailVerification: true, // Require email verification before allowing sign in
        minPasswordLength: 14, // Minimum password length (default 8)
        maxPasswordLength: 128, // Maximum password length (default 128)
        autoSignIn: false, // Disabled because we require email verification
        sendResetPassword, // Email function for sending reset password emails
        resetPasswordTokenExpiresIn: 3600, // Reset password token expiration time in seconds (default 3600 = 1 hour)
        customSyntheticUser,
        onPasswordReset,
        onPasswordChanged,
        onExistingUserSignUp,
    },
    /**
     * Email verification
     */
    emailVerification: {
        sendOnSignUp: true, // Send verification email on sign up
        sendOnSignIn: true, // Send verification email on sign in if email is not verified
        autoSignInAfterVerification: true, // Automatically sign in user after email verification
        sendVerificationEmail, // Email function for sending verification emails
        expiresIn: 3600, // Verification token expiration time in seconds (default 3600 = 1 hour)
    },
    /**
     * Social providers (OAuth)
     */
    socialProviders: {
        // google: {},
        // apple: {},
        // github: {},
        // microsoft: {},
        // facebook: {},
        // twitter: {},
        // discord: {},
        // notion: {},
    },
    /**
     * Account linking and merging
     */
    account: {
        encryptOAuthTokens: true, // Encrypt OAuth tokens before storing in the database
        updateAccountOnSignIn: true, // Update account data on every sign in (e.g. update last login date, etc)
        accountLinking: {
            enabled: true, // Enable account linking
            /**
             * Trusted providers for account linking (must be enabled in socialProviders)
             */
            trustedProviders: [
                "email-password",
                "google",
                "apple",
                "github",
                "microsoft",
                "facebook",
                "twitter",
                "discord",
                "notion",
            ],
            // allowDifferentEmails: true,
            // allowUnlinkingAll: true,
        },
    },
    /**
     * Session lifecycle management
     */
    session: {
        expiresIn: 60 * 60 * 24, // Expires in 24 hours (default 7 days)
        updateAge: 60 * 20, // Update session age every 20 minutes (default 60 minutes)
    },
    /**
     * Rate limiting to protect against brute-force attacks
     * -> 20 attempts every 10 seconds per IP address for all endpoints by default (ex: get session, session refresh, etc.)
     * -> 3 attempts every 10 seconds per IP address for login, signup, and password reset endpoints
     */
    rateLimit: {
        enabled: !isRateLimitDisabled,
        window: 10, // Time window to use for rate limiting in seconds (default 10 seconds)
        max: 20, // Max number of requests allowed within the time window (default 100)
        storage: "memory", // Storage method (default: "memory")
        customRules: {
            // Limit sensitive auth endpoints to 3 attempts every 10 seconds
            "/sign-in/email": { window: 10, max: 3 },
            "/sign-up/email": { window: 10, max: 3 },
            "/request-password-reset": { window: 10, max: 3 },
            "/two-factor/*": { window: 10, max: 3 },
            "/sign-in/magic-link": { window: 10, max: 3 },
            "/sign-in/passkey": { window: 10, max: 5 },
        },
    },
    /**
     * Plugins for extending functionality
     */
    plugins: [
        /**
         * Captcha plugin using Cloudflare Turnstile
         * -> Protects sign-up and request-password-reset endpoints
         * -> Sign-in relies on rate limiting only
         * -> Client must send token via x-captcha-response header
         */
        captcha({
            provider: "cloudflare-turnstile",
            secretKey: TURNSTILE_SECRET_KEY,
            endpoints: ["/sign-up/email", "/request-password-reset"],
        }),
        /**
         * Have I Been Pwned — check passwords against known data breaches
         * -> Uses k-anonymity (only sends 5-char SHA-1 prefix, never the full password)
         * -> Blocks sign-up, reset-password and change-password if password is compromised
         */
        haveIBeenPwned({
            customPasswordCompromisedMessage: "PASSWORD_COMPROMISED",
        }),
        /**
         * OpenAPI plugin to generate Better Auth API docs
         * -> Navigate to: /api/auth/reference
         */
        openAPI(),
        /**
         * Two-Factor Authentication (TOTP + backup codes)
         * -> TOTP via authenticator app (Google Authenticator, Proton Pass, etc.)
         * -> Backup codes for recovery
         */
        twoFactor({ issuer: "Nextjs Deploy", onTotpEnabled, onTotpDisabled }),
        /**
         * Passkey authentication (WebAuthn)
         * -> Touch ID, Windows Hello, FIDO keys
         * -> Passwordless login + 2FA
         */
        passkey({ onPasskeyAdded, onPasskeyDeleted }),
        /**
         * Magic Link authentication
         * -> Passwordless login via email link
         */
        magicLink({ sendMagicLink }),
        /**
         * Extend session data
         * -> add lastname, role, etc
         */
        customSession(extendedSession),
        /**
         * Next JS cookies plugin
         * -> Required for signInEmail, signUpEmail, etc.
         * -> Must be the last plugin in the array
         */
        nextCookies(),
    ],
    /**
     * Hooks for custom logic at different stages of the auth flow
     */
    hooks: {
        /**
         * Before: validate email domain, password strength, block canceled changes,
         * send notification emails on change-email verification
         */
        before: createAuthMiddleware(authBeforeMiddleware),
    },
    /**
     * Advanced configuration options (optional)
     */
    advanced: {
        /**
         * Database configuration
         */
        database: {
            /**
             * Generate nanoid for all models, matching Prisma @default(nanoid())
             */
            generateId: () => nanoid(),
        },
        /**
         * IP address tracking configuration for rate limiting and session tracking
         */
        ipAddress: {
            disableIpTracking: false,
            ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for", "x-client-ip"],
            ipv6Subnet: 64, // Rate limit by /64 subnet to prevent IPv6 rotation bypass
        },
    },
    /**
     * Logging and debugging options
     */
    logger: {
        level: IS_DEV ? "debug" : "warn",
    },
});
