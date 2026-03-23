"use client";

import Button from "@atoms/button";
import { RequiredNote } from "@atoms/form";
import { FormCheckbox, FormInput, FormInputPassword } from "@atoms/form/_adapters";
import Form, { OnSubmit } from "@atoms/form/form";
import { passwordSchema, passwordSchemaOnChange } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { timeout } from "@utils/timout";
import { useState } from "react";
import { z } from "zod";

export default function FormRegister() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState("");

    const { register, states, submit, reset } = useForm({
        pseudo: {
            schema: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        password: {
            schema: passwordSchema,
            onChangeSchema: passwordSchemaOnChange,
            setter: (value: string) => {
                setPassword(value);
                return value;
            },
            defaultValue: "",
        },
        confirmPassword: {
            schema: z
                .string()
                .min(1, "La confirmation est requise")
                .refine((confirmPassword) => password === confirmPassword, "Les mots de passe ne correspondent pas"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        cgv: {
            schema: z.literal(true, { message: "Vous devez accepter les CGU" }),
            setter: (value: boolean) => value,
            defaultValue: false,
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        // Validation
        const values = submit();

        // Cancel if validation fails
        if (!values) return;

        // Set loader after validation
        setIsLoading(true);

        try {
            // Async submission
            await timeout(1000);

            // Toast success
            toast.add({
                title: "Inscription",
                description: `Bienvenue ${values.pseudo} !`,
                type: "success",
            });

            // Redirect if needed
            // router.push("/");

            // Reset form
            reset();
        } catch {
            // Toast error
            toast.add({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'inscription.",
                type: "error",
            });
        }

        // Stop loader
        setIsLoading(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <FormInput
                name="pseudo"
                label="Pseudo"
                description="Min. 3 caractères"
                disabled={isLoading}
                required
                placeholder="jean_dupont"
                autoComplete="username"
            />

            <FormInputPassword
                name="password"
                label="Mot de passe"
                description="Min. 8 caractères, majuscule, chiffre"
                disabled={isLoading}
                required
                placeholder="Votre mot de passe"
                autoComplete="new-password"
            />

            <PasswordStrength password={states.password} />

            <FormInputPassword
                name="confirmPassword"
                label="Confirmer"
                description="Doit correspondre au mot de passe"
                disabled={isLoading}
                required
                placeholder="Confirmez le mot de passe"
                autoComplete="new-password"
            />

            <FormCheckbox
                name="cgv"
                description="Cocher pour accepter les CGU"
                disabled={isLoading}
                required
                label="J'accepte les conditions générales d'utilisation"
            />

            <RequiredNote />

            <div className="flex justify-center">
                <Button type="submit" label="S'inscrire" colors="solid" loading={isLoading} className="w-full" />
            </div>
        </Form>
    );
}
