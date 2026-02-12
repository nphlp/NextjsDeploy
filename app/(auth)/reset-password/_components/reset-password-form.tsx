"use client";

import Button, { Link } from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { resetPassword } from "@lib/auth-client";
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

    const [passwordValue, setPasswordValue] = useState("");

    const { register, submit, reset } = useForm({
        password: {
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

        const { data } = await resetPassword({
            newPassword: values.password,
            token,
        });

        if (!data) {
            toast.add({ title: "Erreur", description: "Impossible de réinitialiser le mot de passe.", type: "error" });
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
            setPasswordValue("");
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
                description="Minimum 14 caractères"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="password"
                    placeholder="Minimum 14 caractères"
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

            {/* TODO: ajouter la <RequiredNote /> */}

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Réinitialiser" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
