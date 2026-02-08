"use client";

import Button, { Link } from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/password-strength";
import { useToast } from "@atoms/toast";
import { resetPassword } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";

const resetPasswordBaseSchema = z.object({
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirmPassword: z.string().min(1, { message: "La confirmation est requise" }),
});

const resetPasswordSchema = resetPasswordBaseSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

const validate = fieldValidator(resetPasswordBaseSchema);

type ResetPasswordFormProps = {
    token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
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
        const result = resetPasswordSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        const { data } = await resetPassword({
            newPassword: result.data.password,
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
            formRef.current?.reset();
            setPasswordValue("");
            setIsSubmitting(false);
        }, 1000);

        router.push("/login");
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            {/* Password */}
            <Field
                label="Nouveau mot de passe"
                name="password"
                validate={validate("password")}
                validationMode="onChange"
            >
                <Control
                    placeholder="Minimum 14 caractères"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    render={<InputPassword onChange={(e) => setPasswordValue(e.target.value)} />}
                />
            </Field>

            {/* Password strength */}
            <PasswordStrength password={passwordValue} />

            {/* Confirm password */}
            <Field
                label="Confirmation"
                name="confirmPassword"
                validate={validateConfirmPassword}
                validationMode="onChange"
            >
                <Control
                    placeholder="Confirmez le mot de passe"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    render={<InputPassword />}
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
