import { ZodType } from "zod";

const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEFAULT_PATH = "/";
const DEFAULT_OPTIONS = "Secure; SameSite=Strict";

type Options = ("Secure" | "SameSite=Strict" | "SameSite=Lax" | "SameSite=None")[];

export const writeCookie = (
    name: string,
    value: string | object,
    props?: {
        path?: string;
        /**
         * Cookie expiration time in milliseconds. Defaults to 30 days. Note that browsers may enforce a maximum of around 400 days, so values above that may be ignored.
         */
        duration?: number;
        options?: Options;
    },
) => {
    const { path, duration, options } = props || {};

    const encodedName = encodeURIComponent(name);

    const stringifiedValue = typeof value === "object" ? JSON.stringify(value) : value;
    const encodedValue = encodeURIComponent(stringifiedValue);

    const cookiePath = path ?? DEFAULT_PATH;

    const now = new Date().getTime();
    const cookieDuration = duration ?? COOKIE_MAX_AGE_MS;
    const cookieExpires = new Date(now + cookieDuration).toUTCString();

    const cookieOptions = options?.join("; ") ?? DEFAULT_OPTIONS;

    document.cookie = `${encodedName}=${encodedValue}; expires=${cookieExpires}; path=${cookiePath}; ${cookieOptions}`;
};

// Cache to ensure referential stability for objects (JSON.parse returns a new reference each time)
const cookieCache = new Map<string, { raw: string; value: unknown }>();

export const readCookie = <T extends string | object>(name: string, schema?: ZodType<T>): T | undefined => {
    try {
        const encodedName = encodeURIComponent(name);

        const regex = new RegExp(`(?:^|; )${encodedName}=([^;]*)`);

        const match = document.cookie.match(regex);

        if (!match) return undefined;

        const cookieEncoded = match[1];

        const cookieRaw = decodeURIComponent(cookieEncoded);

        // Check if a cached entry exists, then return it
        const cached = cookieCache.get(name);
        if (cached && cached.raw === cookieRaw) return cached.value as T;

        const isJson =
            (cookieRaw.startsWith("{") && cookieRaw.endsWith("}")) ||
            (cookieRaw.startsWith("[") && cookieRaw.endsWith("]"));

        const cookieValue = isJson ? JSON.parse(cookieRaw) : cookieRaw;

        // Parse value if a schema is provided
        const value = schema ? schema.parse(cookieValue) : cookieValue;

        // Set cache value for future reads, ensuring referential stability for objects
        cookieCache.set(name, { raw: cookieRaw, value });

        return value;
    } catch {
        return undefined;
    }
};

export const deleteCookie = (name: string, path?: string) => {
    const encodedName = encodeURIComponent(name);
    const cookiePath = path ?? DEFAULT_PATH;

    document.cookie = `${encodedName}=; expires=${new Date(0).toUTCString()}; path=${cookiePath}; ${DEFAULT_OPTIONS}`;
};
