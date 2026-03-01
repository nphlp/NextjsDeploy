import "server-only";

/**
 * Server-side environment variables
 * -> Protected by "server-only" guard
 * -> Client variables are in lib/env-client.ts
 */

const required = (name: string): string => {
    const value = process.env[name];
    if (!value) throw new Error(`${name} environment variable is not defined`);
    return value;
};

// Required
export const NODE_ENV = required("NODE_ENV");
export const NEXT_PUBLIC_BASE_URL = required("NEXT_PUBLIC_BASE_URL");
export const DATABASE_URL = required("DATABASE_URL");
export const BETTER_AUTH_SECRET = required("BETTER_AUTH_SECRET");
export const TURNSTILE_SECRET_KEY = required("TURNSTILE_SECRET_KEY");

// SMTP
export const SMTP_HOST = required("SMTP_HOST");
export const SMTP_PORT = required("SMTP_PORT");
export const SMTP_USER = required("SMTP_USER");
export const SMTP_PASSWORD = required("SMTP_PASSWORD");
export const SMTP_FROM = required("SMTP_FROM");
export const SMTP_FROM_NAME = required("SMTP_FROM_NAME");

// Derived
export const IS_DEV = NODE_ENV === "development";
export const IS_PROD = NODE_ENV === "production";
export const IS_TEST = NODE_ENV === "test";

// Umami analytics (optional)
export const UMAMI_URL = process.env.UMAMI_URL;
export const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
export const IS_UMAMI_DEFINED = !!(UMAMI_URL && UMAMI_WEBSITE_ID);
