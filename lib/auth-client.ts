import { passkeyClient } from "@better-auth/passkey/client";
import {
    customSessionClient,
    inferAdditionalFields,
    magicLinkClient,
    twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { NEXT_PUBLIC_BASE_URL } from "./env-client";

export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_BASE_URL,
    plugins: [
        customSessionClient<typeof auth>(),
        inferAdditionalFields<typeof auth>(),
        twoFactorClient(),
        passkeyClient(),
        magicLinkClient(),
    ],
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
    twoFactor,
    passkey,
} = authClient;

/**
 * Type for the session data
 */
export type SessionClient = ReturnType<typeof useSession>["data"];

export type SessionRefetch = ReturnType<typeof useSession>["refetch"];
