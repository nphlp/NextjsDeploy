import { getSession } from "@lib/auth-server";
import { IS_DEV } from "@lib/env";
import { notFound } from "next/navigation";

export const assertDevAccess = async () => {
    const session = await getSession();
    const isAdmin = session?.user.role === "ADMIN";
    if (!IS_DEV && !isAdmin) notFound();
};
