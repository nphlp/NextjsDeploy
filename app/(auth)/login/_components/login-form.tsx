"use client";

import Button, { Link } from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { signIn } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
    email: z.email({ message: "L'email est invalide ou incomplet" }),
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

const validate = fieldValidator(loginSchema);

export default function LoginForm() {
    const router = useRouter();
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = loginSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        const { data } = await signIn.email({ ...result.data, ...captchaHeaders });

        if (!data) {
            toast.add({ title: "Échec de la connexion", description: "Identifiants invalides.", type: "error" });
            resetCaptcha();
            setIsSubmitting(false);
            return;
        }

        toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

        setTimeout(() => {
            resetCaptcha();
            formRef.current?.reset();
            setIsSubmitting(false);
        }, 1000);

        router.push("/");
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            {/* Email */}
            <Field label="Email" name="email" validate={validate("email")} validationMode="onChange">
                <Control
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    render={<Input autoFocus />}
                />
            </Field>

            {/* Password */}
            <Field label="Mot de passe" name="password" validate={validate("password")} validationMode="onChange">
                <Control
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    render={<InputPassword />}
                />
            </Field>

            {/* Forgot password link */}
            <div className="flex w-full justify-end">
                <Link
                    href="/reset-password"
                    label="Mot de passe oublié ?"
                    className="text-xs text-gray-500 hover:underline"
                    noStyle
                />
            </div>

            {/* Captcha */}
            {captchaWidget}

            {/* Register link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Pas encore de compte ?</span>
                <Link href="/register" label="S'inscrire" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Connexion" loading={isSubmitting || !token} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
