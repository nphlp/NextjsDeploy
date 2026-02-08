"use client";

import Button from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/password-strength";
import { useToast } from "@atoms/toast";
import { changePassword } from "@lib/auth-client";
import { useRef, useState } from "react";
import { z } from "zod";

const updatePasswordBaseSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" }),
    newPassword: z.string().min(8, { message: "Le nouveau mot de passe doit contenir au moins 8 caractères" }),
    confirmPassword: z.string().min(1, { message: "La confirmation est requise" }),
});

const updatePasswordSchema = updatePasswordBaseSchema.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

const validate = fieldValidator(updatePasswordBaseSchema);

export const UpdatePasswordForm = () => {
    const toast = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");

    const validateConfirmPassword = (value: unknown) => {
        const str = String(value ?? "");
        if (str.length < 1) return "La confirmation est requise";
        if (str !== passwordValue) return "Les mots de passe ne correspondent pas";
        return null;
    };

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = updatePasswordSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        const { data } = await changePassword({
            currentPassword: result.data.currentPassword,
            newPassword: result.data.newPassword,
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

        formRef.current?.reset();
        setPasswordValue("");
        setIsSubmitting(false);
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Mettre à jour votre mot de passe</p>
                <p className="text-sm text-gray-600">
                    Entrer votre mot de passe actuel puis votre nouveau mot de passe
                </p>
            </div>

            <Field
                label="Mot de passe actuel"
                name="currentPassword"
                validate={validate("currentPassword")}
                validationMode="onChange"
            >
                <Control
                    placeholder="Mot de passe actuel"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    render={<InputPassword />}
                />
            </Field>

            <Field
                label="Nouveau mot de passe"
                name="newPassword"
                validate={validate("newPassword")}
                validationMode="onChange"
            >
                <Control
                    placeholder="Nouveau mot de passe"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    render={<InputPassword onChange={(e) => setPasswordValue(e.target.value)} />}
                />
            </Field>

            {/* Password strength */}
            <PasswordStrength password={passwordValue} />

            <Field
                label="Confirmation"
                name="confirmPassword"
                validate={validateConfirmPassword}
                validationMode="onChange"
            >
                <Control
                    placeholder="Confirmez le nouveau mot de passe"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    render={<InputPassword />}
                />
            </Field>

            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};
