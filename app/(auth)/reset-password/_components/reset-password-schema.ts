import { z } from "zod";

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
        confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
