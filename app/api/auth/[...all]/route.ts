import { auth } from "@lib/auth";
import { BETTER_AUTH_SECRET } from "@lib/env";
import PrismaInstance from "@lib/prisma";
import { toNextJsHandler } from "better-auth/next-js";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const { GET: defaultGET, POST } = toNextJsHandler(auth);

/**
 * Custom GET handler
 * -> Block canceled change-email verifications before Better Auth processes them
 * -> The before middleware hook does NOT fire for GET endpoints in Better Auth
 */
async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.replace("/api/auth", "");

    if (path === "/verify-email") {
        const token = url.searchParams.get("token");

        if (token) {
            try {
                const secret = new TextEncoder().encode(BETTER_AUTH_SECRET);
                const { payload } = await jwtVerify(token, secret);

                // Only check change-email verifications (JWT has updateTo field)
                if (payload.updateTo && typeof payload.email === "string") {
                    const user = await PrismaInstance.user.findFirst({ where: { email: payload.email } });

                    if (!user || user.pendingEmail !== payload.updateTo) {
                        const callbackURL = url.searchParams.get("callbackURL") ?? "/";
                        const separator = callbackURL.includes("?") ? "&" : "?";
                        return NextResponse.redirect(
                            new URL(`${callbackURL}${separator}error=EMAIL_CHANGE_CANCELED`, request.url),
                        );
                    }
                }
            } catch (error) {
                // Invalid JWT → let Better Auth handle the error
                console.error("verify-email route handler error:", error);
            }
        }
    }

    return defaultGET(request);
}

export { GET, POST };
