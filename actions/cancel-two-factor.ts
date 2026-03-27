"use server";

import { cookies } from "next/headers";

export default async function CancelTwoFactorAction() {
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.two_factor");
    cookieStore.delete("__Secure-better-auth.two_factor");
}
