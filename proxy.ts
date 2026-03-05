import { auth } from "@lib/auth";
import { sanitizeRedirect } from "@utils/sanitize-redirect";
import { NextRequest, NextResponse } from "next/server";
import csrfProtection from "./api/csrf";

const getSession = (request: NextRequest) => auth.api.getSession({ headers: request.headers });

const isPending2FA = (request: NextRequest): boolean =>
    request.cookies.has("better-auth.two_factor") || request.cookies.has("__Secure-better-auth.two_factor");

const guestRoutes = new Set([
    // Routes requiring no auth
    "/login",
    "/login/success",
    "/register",
    "/register/success",
    "/reset-password",
    "/reset-password/success",
]);

const protectedRoutes = new Set([
    // Routes requiring auth
    "/baskets",
    "/fruit/create",
    "/profile",
]);

export default async function proxy(request: NextRequest) {
    // CSRF protection
    const csrfResponse = await csrfProtection(request);
    if (csrfResponse.status === 403) return csrfResponse;

    const { pathname } = request.nextUrl;

    // Guest-only routes
    // -> redirect /home if already logged in
    // -> redirect /verify-2fa if 2FA pending
    if (guestRoutes.has(pathname)) {
        const session = await getSession(request);
        const redirect = sanitizeRedirect(request.nextUrl.searchParams.get("redirect"));

        if (session) {
            return NextResponse.redirect(new URL(redirect || "/", request.url));
        }

        // Login only: if 2FA pending, redirect to verify-2fa
        if (pathname === "/login" && isPending2FA(request)) {
            const url = new URL("/verify-2fa", request.url);
            if (redirect) url.searchParams.set("redirect", redirect);
            return NextResponse.redirect(url);
        }
    }

    // 2FA verification route
    // -> redirect /home if already logged in
    // -> redirect /login if 2FA is not pending
    if (pathname === "/verify-2fa") {
        const session = await getSession(request);
        const redirect = sanitizeRedirect(request.nextUrl.searchParams.get("redirect"));

        if (session) {
            return NextResponse.redirect(new URL(redirect || "/", request.url));
        }

        if (!isPending2FA(request)) {
            const url = new URL("/login", request.url);
            if (redirect) url.searchParams.set("redirect", redirect);
            return NextResponse.redirect(url);
        }
    }

    // Protected routes
    // -> redirect /login if not logged in
    if (protectedRoutes.has(pathname)) {
        const session = await getSession(request);

        if (!session) {
            const url = new URL("/login", request.url);
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }
    }

    // Admin routes
    // -> redirect /404 for non-admins in production
    if (pathname.startsWith("/dev")) {
        if (process.env.NODE_ENV !== "development") {
            const session = await getSession(request);
            const isAdmin = session?.user.role === "ADMIN";

            if (!isAdmin) {
                return NextResponse.rewrite(new URL("/_not-found", request.url));
            }
        }
    }

    return NextResponse.next();
}
