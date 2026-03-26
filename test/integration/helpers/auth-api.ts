import { auth } from "@lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

/**
 * Call Better Auth API directly (server-side, no HTTP)
 */
/** Dummy captcha token for Turnstile test secret key (always passes) */
const CAPTCHA_HEADER = { "x-captcha-response": "test-captcha-token" };

async function callAuth(
    path: string,
    options: { method?: string; body?: Record<string, unknown>; headers?: Record<string, string> } = {},
) {
    const { method = "POST", body, headers = {} } = options;

    const request = new Request(`${BASE_URL}/api/auth${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...CAPTCHA_HEADER, ...headers },
        body: body ? JSON.stringify(body) : undefined,
    });

    return auth.handler(request);
}

/**
 * Register a new user via Better Auth API
 */
export async function registerUser(email: string, password: string, name = "Test", lastname = "User") {
    const response = await callAuth("/sign-up/email", {
        body: { email, password, name, lastname },
    });
    return { response, data: await response.json().catch(() => null) };
}

/**
 * Login via Better Auth API
 */
export async function loginUser(email: string, password: string) {
    const response = await callAuth("/sign-in/email", {
        body: { email, password },
    });
    return { response, data: await response.json().catch(() => null) };
}

/**
 * Verify email via Better Auth API (GET with token)
 */
export async function verifyEmail(token: string) {
    const request = new Request(`${BASE_URL}/api/auth/verify-email?token=${token}`, {
        method: "GET",
    });
    return auth.handler(request);
}

/**
 * Request password reset via Better Auth API
 */
export async function requestPasswordReset(email: string) {
    const response = await callAuth("/forget-password", {
        body: { email, redirectTo: "/reset-password" },
    });
    return { response, data: await response.json().catch(() => null) };
}

/**
 * Change email via Better Auth API (requires session cookie)
 */
export async function changeEmail(newEmail: string, sessionCookie: string) {
    const response = await callAuth("/change-email", {
        body: { newEmail, callbackURL: "/profile?tab=security" },
        headers: { Cookie: sessionCookie },
    });
    return { response, data: await response.json().catch(() => null) };
}

/**
 * Change password via Better Auth API (requires session cookie)
 */
export async function changePassword(currentPassword: string, newPassword: string, sessionCookie: string) {
    const response = await callAuth("/change-password", {
        body: { currentPassword, newPassword, revokeOtherSessions: true },
        headers: { Cookie: sessionCookie },
    });
    return { response, data: await response.json().catch(() => null) };
}

/**
 * Extract session cookie from response headers
 */
export function extractSessionCookie(response: Response): string {
    const setCookie = response.headers.getSetCookie?.() ?? [];
    const sessionCookie = setCookie.find((c) => c.startsWith("better-auth.session_token="));
    return sessionCookie?.split(";")[0] ?? "";
}
