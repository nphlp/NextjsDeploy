/**
 * Client-safe environment variables (NEXT_PUBLIC_ only)
 * -> Can be imported in "use client" components
 * -> Server-only variables are in lib/env.ts (import "server-only")
 */

if (!process.env.NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");
if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
    throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY environment variable is not defined");

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const NEXT_PUBLIC_TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

export { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_TURNSTILE_SITE_KEY };
