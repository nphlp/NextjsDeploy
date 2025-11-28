import { z } from "zod";

export const registerSchema = z
    .object({
        firstname: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
        lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
        email: z.email({ message: "Email invalide" }),
        password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
        confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
