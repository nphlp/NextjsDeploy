import { cookies, headers } from "next/headers";
import { cache } from "react";
import "server-only";
import { auth } from "./auth";

type InferredSession = typeof auth.$Infer.Session;

export const getSession = async (): Promise<InferredSession | null> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session as InferredSession | null;
};

// Deduplicate across layout + page + nested RSC within a single request.
export const getCachedSession = cache(getSession);

export type Session = InferredSession | null;

type InferredSessionData = typeof auth.$Infer.Session.session;

export const getSessionList = async () => {
    const sessionList = await auth.api.listSessions({
        headers: await headers(),
    });
    return sessionList as InferredSessionData[];
};

export type SessionList = InferredSessionData[];

export const isPendingTwoFactor = async () => {
    const cookieStore = await cookies();
    return cookieStore.has("better-auth.two_factor") || cookieStore.has("__Secure-better-auth.two_factor");
};
