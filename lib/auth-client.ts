import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { NEXT_PUBLIC_BASE_URL } from "./env-client";

export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_BASE_URL,
    plugins: [customSessionClient<typeof auth>()],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    revokeSession,
    revokeOtherSessions,
    updateUser,
    changeEmail,
    changePassword,
    sendVerificationEmail,
    requestPasswordReset,
    resetPassword,
} = authClient;

/**
 * Type for the session data
 */
export type SessionClient = ReturnType<typeof useSession>["data"];

export type SessionRefetch = ReturnType<typeof useSession>["refetch"];
