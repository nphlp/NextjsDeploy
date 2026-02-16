"use client";

import Button, { Link } from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { requestPasswordReset } from "@lib/auth-client";
import { useState } from "react";
import z from "zod";

export default function RequestResetForm() {
    const [emailSent, setEmailSent] = useState(false);
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();

    const { register, submit, reset } = useForm({
        email: {
            schema: emailSchema,
            onChangeSchema: emailSchemaProgressive,
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();
        const values = submit();
        if (!values) return;

        setEmailSent(true);

        toast.add({
            title: "Email envoyé",
            description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
            type: "success",
        });

        setTimeout(() => {
            setEmailSent(false);
            resetCaptcha();
            reset();
        }, 5000);

        requestPasswordReset({
            email: values.email,
            redirectTo: "/reset-password",
            ...captchaHeaders,
        });
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Email */}
            <Field name="email" label="Email" description="Entrez votre adresse email" disabled={emailSent} required>
                <Input
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    autoFocus
                    useForm
                />
            </Field>

            {/* Captcha */}
            {captchaWidget}

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Mot de passe retrouvé ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    label={emailSent ? "Email envoyé !" : "Envoyer l'email"}
                    disabled={!token || emailSent}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
