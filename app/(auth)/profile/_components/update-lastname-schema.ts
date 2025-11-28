import { z } from "zod";

export const updateLastnameSchema = z.object({
    lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
});

export type UpdateLastnameFormValues = z.infer<typeof updateLastnameSchema>;
