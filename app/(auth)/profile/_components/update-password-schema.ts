import { z } from "zod";

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" }),
    newPassword: z.string().min(8, { message: "Le nouveau mot de passe doit contenir au moins 8 caractères" }),
});

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
