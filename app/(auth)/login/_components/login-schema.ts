import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
