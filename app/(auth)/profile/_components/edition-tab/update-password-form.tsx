"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { passwordSchema, passwordSchemaOnChange } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { changePassword } from "@lib/auth-client";
import { translateAuthError } from "@lib/auth-errors";
import { useState } from "react";
import { z } from "zod";

export const UpdatePasswordForm = () => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [password, setPassword] = useState("");

    const { register, states, submit, reset } = useForm({
        currentPassword: {
            schema: z.string().min(1, "Le mot de passe actuel est requis"),
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
            setter: (value: string) => value,
            defaultValue: "",
        },
        newPassword: {
            schema: passwordSchema,
            onChangeSchema: passwordSchemaOnChange,
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
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
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const validated = submit();
        if (!validated) return;

        setIsSubmitting(true);

        const { data, error } = await changePassword({
            currentPassword: validated.currentPassword,
            newPassword: validated.newPassword,
            revokeOtherSessions: true,
        });

        if (!data) {
            toast.add({
                title: "Échec",
                description: translateAuthError(error?.message),
                type: "error",
            });

            setIsSubmitting(false);
            return;
        }

        toast.add({
            title: "Mot de passe modifié",
            description: "Vos modifications ont été enregistrées.",
            type: "success",
        });

        reset();
        setIsSubmitting(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Mettre à jour votre mot de passe</p>
                <p className="text-sm text-gray-600">
                    Entrer votre mot de passe actuel puis votre nouveau mot de passe
                </p>
            </div>

            {/* Current password */}
            <Field
                name="currentPassword"
                label="Mot de passe actuel"
                description="Entrez votre mot de passe actuel"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="currentPassword"
                    placeholder="Mot de passe actuel"
                    autoComplete="current-password"
                    useForm
                />
            </Field>

            {/* New password */}
            <Field
                name="newPassword"
                label="Nouveau mot de passe"
                description="Veillez remplir tous les critères de sécurité"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="newPassword"
                    placeholder="Nouveau mot de passe"
                    autoComplete="new-password"
                    useForm
                />
            </Field>

            {/* Password strength */}
            <PasswordStrength password={states.newPassword} />

            {/* Confirm password */}
            <Field
                name="confirmPassword"
                label="Confirmation"
                description="Confirmez le nouveau mot de passe"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="confirmPassword"
                    placeholder="Confirmez le nouveau mot de passe"
                    autoComplete="new-password"
                    useForm
                />
            </Field>

            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};
