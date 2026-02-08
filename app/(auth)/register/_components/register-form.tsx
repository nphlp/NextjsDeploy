"use client";

import Button, { Link } from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/password-strength";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { signUp } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";

const registerBaseSchema = z.object({
    firstname: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirmPassword: z.string().min(1, { message: "La confirmation est requise" }),
});

const registerSchema = registerBaseSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

const validate = fieldValidator(registerBaseSchema);

export default function RegisterForm() {
    const router = useRouter();
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();
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
        const result = registerSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        const { firstname, lastname, email, password } = result.data;

        const { data } = await signUp.email({
            name: firstname,
            lastname,
            email,
            password,
            ...captchaHeaders,
        });

        if (!data) {
            toast.add({ title: "Échec de l'inscription", description: "Veuillez réessayer.", type: "error" });
            resetCaptcha();
            setIsSubmitting(false);
            return;
        }

        toast.add({ title: "Inscription réussie", description: "Bienvenue sur l'application !", type: "success" });

        setTimeout(() => {
            resetCaptcha();
            formRef.current?.reset();
            setPasswordValue("");
            setIsSubmitting(false);
        }, 1000);

        router.push("/");
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            {/* Firstname */}
            <Field label="Prénom" name="firstname" validate={validate("firstname")} validationMode="onChange">
                <Control
                    placeholder="Jean"
                    autoComplete="given-name"
                    disabled={isSubmitting}
                    render={<Input autoFocus />}
                />
            </Field>

            {/* Lastname */}
            <Field label="Nom" name="lastname" validate={validate("lastname")} validationMode="onChange">
                <Control placeholder="Dupont" autoComplete="family-name" disabled={isSubmitting} render={<Input />} />
            </Field>

            {/* Email */}
            <Field label="Email" name="email" validate={validate("email")} validationMode="onChange">
                <Control
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    render={<Input />}
                />
            </Field>

            {/* Password */}
            <Field label="Mot de passe" name="password" validate={validate("password")} validationMode="onChange">
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
                    loading={isSubmitting || !token}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
