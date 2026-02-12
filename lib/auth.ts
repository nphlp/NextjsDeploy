import SendEmailAction from "@actions/SendEmailAction";
import EmailTemplate from "@comps/email";
import PrismaInstance from "@lib/prisma";
import { betterAuth } from "better-auth";
import { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { captcha, customSession, openAPI } from "better-auth/plugins";
import { authBeforeMiddleware } from "./auth-middleware";
import { BETTER_AUTH_SECRET, IS_DEV, NEXT_PUBLIC_BASE_URL, TURNSTILE_SECRET_KEY } from "./env";

type SendResetPasswordProps = NonNullable<NonNullable<BetterAuthOptions["emailAndPassword"]>["sendResetPassword"]>;

/**
 * Send reset password link to user email
 */
export const sendResetPassword: SendResetPasswordProps = async (data) => {
    const { user, url } = data;

    await SendEmailAction({
        subject: `Reset your password`,
        email: user.email,
        body: EmailTemplate({ buttonUrl: url, emailType: "reset" }),
    });
};

type SendVerificationEmailProps = NonNullable<
    NonNullable<BetterAuthOptions["emailVerification"]>["sendVerificationEmail"]
>;

/**
 * Send verification link to user email
 */
export const sendVerificationEmail: SendVerificationEmailProps = async (data) => {
    const { user, url } = data;

    await SendEmailAction({
        subject: `Welcome ${user.name}! Let's verify your email.`,
        email: user.email,
        body: EmailTemplate({ buttonUrl: url, emailType: "verification" }),
    });
};

type ExtendedSession = Parameters<typeof customSession>[0];

/**
 * Extend session data
 * -> add lastname, role, etc
 */
const extendedSession: ExtendedSession = async (data) => {
    const { user, session } = data;

    const userData = await PrismaInstance.user.findUnique({ where: { id: user.id } });
    if (!userData) throw new Error("User not found");

    const extendedSession = {
        user: {
            ...user,
            lastname: userData.lastname, // Add lastname to session
            role: userData.role, // Add role to session (e.g. "user", "admin", etc)
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
    /**
     * Database adapter using Prisma
     */
    database: prismaAdapter(PrismaInstance, {
        provider: "postgresql",
    }),
    /**
     * Extend user schema with custom fields
     */
    user: {
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
        /**
         * If user hasn't verified their email yet and he resets his password
         * Automatically verify email on password reset
         */
        onPasswordReset: async ({ user }) => {
            await PrismaInstance.user.update({
                where: { id: user.id },
                data: { emailVerified: true },
            });
        },
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
        enabled: true,
        window: 10, // Time window to use for rate limiting in seconds (default 10 seconds)
        max: 20, // Max number of requests allowed within the time window (default 100)
        storage: "memory", // Storage method (default: "memory")
        customRules: {
            // Limit sensitive auth endpoints to 3 attempts every 10 seconds
            "/sign-in/email": { window: 10, max: 3 },
            "/sign-up/email": { window: 10, max: 3 },
            "/reset-password": { window: 10, max: 3 },
        },
    },
    /**
     * Plugins for extending functionality
     */
    plugins: [
        /**
         * Captcha plugin using Cloudflare Turnstile
         * -> Protects sign-up and reset-password endpoints
         * -> Sign-in relies on rate limiting only
         * -> Client must send token via x-captcha-response header
         */
        captcha({
            provider: "cloudflare-turnstile",
            secretKey: TURNSTILE_SECRET_KEY,
            endpoints: ["/sign-up/email", "/reset-password"],
        }),
        /**
         * OpenAPI plugin to generate Better Auth API docs
         * -> Navigate to: /api/auth/reference
         */
        openAPI(),
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
         * Auth middleware
         * -> Enforce email domain restrictions on sign-up or change email
         * -> Validate password strength on sign-up, reset-password and change-password
         */
        before: createAuthMiddleware(authBeforeMiddleware),
    },
    /**
     * Advanced configuration options (optional)
     */
    advanced: {
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
