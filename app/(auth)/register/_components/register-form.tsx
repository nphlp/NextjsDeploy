"use client";

import Form, {
    FormInput,
    FormInputPassword,
    OnSubmit,
    emailSchema,
    emailSchemaProgressive,
    nameSchema,
    passwordSchema,
    passwordSchemaOnBlur,
    passwordSchemaOnChange,
    useForm,
} from "@atoms/_form";
import Button, { Link } from "@atoms/button";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { signUp } from "@lib/auth-client";
import { isValidationError, translateAuthError } from "@lib/auth-errors";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { queryUrlSerializer } from "../success/_lib/query-params";

export default function RegisterForm() {
    const router = useRouter();
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [password, setPassword] = useState("");

    const { register, states, submit, reset } = useForm({
        firstname: {
            schema: nameSchema,
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
            setter: (value: string) => value,
            defaultValue: "",
        },
        lastname: {
            schema: nameSchema,
            setter: (value: string) => value,
            defaultValue: "",
        },
        email: {
            schema: emailSchema,
            onChangeSchema: emailSchemaProgressive,
            setter: (value: string) => value,
            defaultValue: "",
        },
        password: {
            schema: passwordSchema,
            onChangeSchema: passwordSchemaOnChange,
            onBlurSchema: passwordSchemaOnBlur,
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

        // Validation
        const validated = submit();

        // Cancel if validation fails
        if (!validated) return;

        // Set loader after validation
        setIsSubmitting(true);

        const { firstname, lastname, email, password } = validated;

        try {
            // Async submission
            const { data, error } = await signUp.email({
                name: firstname,
                lastname,
                email,
                password,
                ...captchaHeaders,
            });

            if (!data) {
                const isDisplayableError = isValidationError(error?.message);

                if (isDisplayableError) {
                    // Toast error
                    toast.add({
                        title: "Échec de l'inscription",
                        description: translateAuthError(error?.message),
                        type: "error",
                    });
                    resetCaptcha();
                    setIsSubmitting(false);
                    return;
                }
            }

            // Reset form (delayed to avoid visible field clearing)
            setTimeout(() => {
                resetCaptcha();
                reset();
                setIsSubmitting(false);
            }, 1000);

            // Redirect
            router.push(queryUrlSerializer("/register/success", { email }));
        } catch {
            // Toast error
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
            resetCaptcha();
            setIsSubmitting(false);
        }
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Firstname */}
            <FormInput
                name="firstname"
                label="Prénom"
                description="Entrez votre prénom"
                disabled={isSubmitting}
                required
                placeholder="Jean"
                autoComplete="given-name"
                autoFocus
            />

            {/* Lastname */}
            <FormInput
                name="lastname"
                label="Nom"
                description="Entrez votre nom"
                disabled={isSubmitting}
                required
                placeholder="Dupont"
                autoComplete="family-name"
            />

            {/* Email */}
            <FormInput
                name="email"
                label="Email"
                description="Entrez votre adresse email"
                disabled={isSubmitting}
                required
                type="email"
                placeholder="exemple@email.com"
                autoComplete="email"
            />

            {/* Password */}
            <FormInputPassword
                name="password"
                label="Mot de passe"
                description="Veillez remplir tous les critères de sécurité"
                disabled={isSubmitting}
                required
                placeholder="Mot de passe"
                autoComplete="new-password"
            />

            {/* Password strength */}
            <PasswordStrength password={states.password} />

            {/* Confirm password */}
            <FormInputPassword
                name="confirmPassword"
                label="Confirmation"
                description="Confirmez le mot de passe"
                disabled={isSubmitting}
                required
                placeholder="Confirmez le mot de passe"
                autoComplete="new-password"
            />

            {/* Captcha */}
            {captchaWidget}

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Déjà un compte ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    label="S'inscrire"
                    colors="solid"
                    loading={isSubmitting}
                    disabled={!token}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
