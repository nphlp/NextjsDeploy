"use client";

import Form, { FormInput, OnSubmit, emailSchema, emailSchemaProgressive, useForm } from "@atoms/_form";
import Button, { Link } from "@atoms/button";
import { useTurnstile } from "@atoms/use-turnstile";
import { requestPasswordReset } from "@lib/auth-client";
import { useState } from "react";
import z from "zod";
import { queryUrlSerializer } from "../success/_lib/query-params";

export default function RequestResetForm() {
    const [emailSent, setEmailSent] = useState(false);
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

        requestPasswordReset({
            email: values.email,
            redirectTo: "/reset-password",
            ...captchaHeaders,
        });

        setTimeout(() => {
            setEmailSent(false);
            resetCaptcha();
            reset();
        }, 1000);

        // Redirect to success page
        window.location.href = queryUrlSerializer("/reset-password/success", { email: values.email });
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Email */}
            <FormInput
                name="email"
                label="Email"
                description="Entrez votre adresse email"
                disabled={emailSent}
                required
                type="email"
                placeholder="exemple@email.com"
                autoComplete="email"
                autoFocus
            />

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
                    colors="solid"
                    disabled={!token || emailSent}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
