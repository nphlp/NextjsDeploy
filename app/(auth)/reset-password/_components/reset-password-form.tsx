"use client";

import Button, { Link } from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { passwordSchema, passwordSchemaOnChange } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { resetPassword } from "@lib/auth-client";
import { translateAuthError } from "@lib/auth-errors";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type ResetPasswordFormProps = {
    token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [password, setPassword] = useState("");

    const { register, states, submit, reset } = useForm({
        password: {
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
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const validated = submit();
        if (!validated) return;

        setIsSubmitting(true);

        const { data, error } = await resetPassword({
            newPassword: validated.password,
            token,
        });

        if (!data) {
            toast.add({ title: "Erreur", description: translateAuthError(error?.message), type: "error" });
            setIsSubmitting(false);
            return;
        }

        toast.add({
            title: "Mot de passe réinitialisé",
            description: "Vous allez être redirigé vers la connexion.",
            type: "success",
        });

        setTimeout(() => {
            reset();
            setIsSubmitting(false);
        }, 1000);

        router.push("/login");
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Password */}
            <Field
                name="password"
                label="Nouveau mot de passe"
                description="Veillez remplir tous les critères de sécurité"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="password"
                    placeholder="Nouveau mot de passe"
                    autoComplete="new-password"
                    autoFocus
                    useForm
                />
            </Field>

            {/* Password strength */}
            <PasswordStrength password={states.password} />

            {/* Confirm password */}
            <Field
                name="confirmPassword"
                label="Confirmation"
                description="Confirmez le mot de passe"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="confirmPassword"
                    placeholder="Confirmez le mot de passe"
                    autoComplete="new-password"
                    useForm
                />
            </Field>

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Mot de passe retrouvé ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Réinitialiser" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
