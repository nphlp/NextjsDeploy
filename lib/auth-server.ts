import { cookies, headers } from "next/headers";
import "server-only";
import { auth } from "./auth";

type InferredSession = typeof auth.$Infer.Session;

export const getSession = async (): Promise<InferredSession | null> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session as InferredSession | null;
};

export type Session = InferredSession | null;

export const getSessionList = async () => {
    const sessionList = await auth.api.listSessions({
        headers: await headers(),
    });
    return sessionList;
};

export type SessionList = Awaited<ReturnType<typeof getSessionList>>;

export const isPendingTwoFactor = async () => {
    const cookieStore = await cookies();
    return cookieStore.has("better-auth.two_factor") || cookieStore.has("__Secure-better-auth.two_factor");
};
