import { Session, getSession } from "@lib/auth-server";
import { os } from "@orpc/server";
import { NextResponse } from "next/server";

/**
 * Has session middleware
 *
 * @example
 * ```ts
 * const userFindMany = base
 *     .use(requiresSession)
 *     .handler(async () => {})
 * ```
 */
const requiresSession = os.middleware(async ({ next }) => {
    const session = await getSession();

    if (!session) {
        throw new NextResponse("Unauthorized: requires to be logged in", { status: 401 });
    }

    return next({
        context: { session },
    });
});

/**
 * Is admin middleware
 *
 * @example
 * ```ts
 * const userFindMany = base
 *     .use(requiresSession)
 *     .use(isAdmin)
 *     .handler(async () => {})
 * ```
 */
const isAdmin = os.middleware(async ({ context, next }) => {
    const session = (context as { session: NonNullable<Session> })?.session;

    if (!session) {
        throw new NextResponse("Unauthorized: session is missing", { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";

    if (!isAdmin) {
        throw new NextResponse("Unauthorized: requires to have admin role", { status: 401 });
    }

    return next();
});

/**
 * Is Owner middleware
 *
 * @example
 * ```ts
 * const userFindUnique = base
 *     .input(z.object({ userId: z.number() }))
 *     .use(requiresSession)
 *     .use(isOwner, userId => input.userId)
 *     .handler(async () => {})
 * ```
 */
const isOwner = os.middleware(async ({ context, next }, userId) => {
    const session = (context as { session: NonNullable<Session> })?.session;

    if (!session) {
        throw new NextResponse("Unauthorized: session is missing", { status: 401 });
    }

    const isOwner = session.user.id === userId;

    if (!isOwner) {
        throw new NextResponse("Unauthorized: requires to be the owner", { status: 401 });
    }

    return next();
});

export { requiresSession, isAdmin, isOwner };
