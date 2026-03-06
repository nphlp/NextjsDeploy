import { cookies } from "next/headers";
import "server-only";
import { ZodType } from "zod";

export const getCookieState = async <T extends string | object>(
    name: string,
    schema: ZodType<T>,
): Promise<T | undefined> => {
    try {
        const cookieStore = await cookies();

        const cookieEncoded = cookieStore.get(name)?.value;

        if (!cookieEncoded) return undefined;

        const cookieRaw = decodeURIComponent(cookieEncoded);

        const isJson =
            (cookieRaw.startsWith("{") && cookieRaw.endsWith("}")) ||
            (cookieRaw.startsWith("[") && cookieRaw.endsWith("]"));

        const cookieValue = isJson ? JSON.parse(cookieRaw) : cookieRaw;

        return schema.parse(cookieValue);
    } catch {
        return undefined;
    }
};
