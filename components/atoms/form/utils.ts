import { z } from "zod";

export const fieldValidator =
    <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
    (fieldName: keyof T) =>
    (value: unknown) => {
        const result = (schema.shape[fieldName] as unknown as z.ZodType).safeParse(value);
        return result.success ? null : result.error.issues[0].message;
    };
