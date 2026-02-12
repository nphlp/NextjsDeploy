"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { changePassword } from "@lib/auth-client";
import { useState } from "react";
import { z } from "zod";

export const UpdatePasswordForm = () => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");

    const { register, submit, reset } = useForm({
        currentPassword: {
            schema: z.string().min(1, "Le mot de passe actuel est requis"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        newPassword: {
            // TODO: faire la même validation que dans le middleware
            schema: z
                .string()
                .min(14, "Le mot de passe doit contenir au moins 14 caractères")
                .max(128, "Le mot de passe doit contenir au maximum 128 caractères"),
            setter: (value: string) => {
                // TODO: faire ça avec un ref pour éviter des doubles re-render à chaque frappe
                setPasswordValue(value);
                return value;
            },
            defaultValue: "",
        },
        confirmPassword: {
            schema: z
                .string()
                .min(1, "La confirmation est requise")
                .refine((val) => val === passwordValue, "Les mots de passe ne correspondent pas"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { data } = await changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: true,
        });

        if (!data) {
            toast.add({
                title: "Échec",
                description: "Le mot de passe actuel est peut-être incorrect.",
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
        setPasswordValue("");

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
                description="Minimum 14 caractères"
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
            <PasswordStrength password={passwordValue} />

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

            {/* TODO: ajouter la <RequiredNote /> */}

            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};
