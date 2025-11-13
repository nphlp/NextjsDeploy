import { z } from "zod";

export const fruitDisplayCookieName = "fruit-display-cookie";

export const fruitDisplayCookieSchema = z.object({
    take: z.union([z.literal(3), z.literal(10)]),
});

export type FruitDisplayCookie = z.infer<typeof fruitDisplayCookieSchema>;
