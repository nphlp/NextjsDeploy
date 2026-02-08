"use client";

import Button, { Link } from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { requestPasswordReset } from "@lib/auth-client";
import { useRef, useState } from "react";
import { z } from "zod";

const requestResetSchema = z.object({
    email: z.email({ message: "Email invalide" }),
});

const validate = fieldValidator(requestResetSchema);

export default function RequestResetForm() {
    const [emailSent, setEmailSent] = useState(false);
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = requestResetSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        const { data } = await requestPasswordReset({
            email: result.data.email,
            redirectTo: "/reset-password",
            ...captchaHeaders,
        });

        if (!data) {
            toast.add({
                title: "Erreur",
                description: "Impossible d'envoyer l'email de réinitialisation.",
                type: "error",
            });
            resetCaptcha();
            setIsSubmitting(false);
            return;
        }

        setEmailSent(true);
        setIsSubmitting(false);

        toast.add({ title: "Email envoyé", description: "Vérifiez votre boîte de réception.", type: "success" });

        setTimeout(() => {
            setEmailSent(false);
            resetCaptcha();
            formRef.current?.reset();
        }, 5000);
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            {/* Email */}
            <Field label="Email" name="email" validate={validate("email")} validationMode="onChange">
                <Control
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    disabled={isSubmitting || emailSent}
                    render={<Input autoFocus />}
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
                    loading={isSubmitting || !token}
                    disabled={emailSent}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
