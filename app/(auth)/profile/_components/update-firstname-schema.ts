import { z } from "zod";

export const updateFirstnameSchema = z.object({
    name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
});

export type UpdateFirstnameFormValues = z.infer<typeof updateFirstnameSchema>;
