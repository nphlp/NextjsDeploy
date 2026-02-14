import { auth } from "@lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { nanoid } from "nanoid";

const { GET, POST: authPOST } = toNextJsHandler(auth);

/**
 * Proxy POST to prevent email enumeration (OWASP).
 *
 * Better Auth returns a 422 with code USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
 * when registering with an existing email. This leaks account existence
 * to anyone inspecting the network response, even if the UI shows a fake success.
 *
 * This proxy intercepts that 422 and returns a fake 200 with realistic user data
 * built from the request body, making the response indistinguishable from a real sign-up.
 *
 * See: https://github.com/better-auth/better-auth/issues/7972
 * Remove this proxy when Better Auth fixes this server-side.
 *
 * TODO: If we enable the emailOtp plugin, also intercept USER_NOT_FOUND
 * on OTP endpoints (same enumeration leak pattern).
 */
async function POST(request: Request) {
    const clonedRequest = request.clone();
    const response = await authPOST(request);

    if (response.status === 422 && request.url.includes("/sign-up/email")) {
        const error = await response.clone().json();

        if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            const { name, lastname, email } = await clonedRequest.json();
            const now = new Date().toISOString();

            return Response.json({
                token: null,
                user: {
                    name,
                    email,
                    emailVerified: false,
                    image: null,
                    createdAt: now,
                    updatedAt: now,
                    lastname,
                    id: nanoid(),
                },
            });
        }
    }

    return response;
}

export { GET, POST };
