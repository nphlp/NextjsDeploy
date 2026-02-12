"use client";

import Button, { Link } from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/input/password-strength";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { signUp } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function RegisterForm() {
    const router = useRouter();
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [passwordValue, setPasswordValue] = useState("");

    const { register, submit, reset } = useForm({
        firstname: {
            // TODO: lettre uniquement
            schema: z.string().min(1, "Le champ est requis"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        lastname: {
            // TODO: lettre uniquement
            schema: z.string().min(1, "Le champ est requis"),
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

        const { firstname, lastname, email, password } = values;

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
            reset();
            setPasswordValue("");
            setIsSubmitting(false);
        }, 1000);

        router.push("/");
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Firstname */}
            <Field name="firstname" label="Prénom" description="Entrez votre prénom" disabled={isSubmitting} required>
                <Input name="firstname" placeholder="Jean" autoComplete="given-name" autoFocus useForm />
            </Field>

            {/* Lastname */}
            <Field name="lastname" label="Nom" description="Entrez votre nom" disabled={isSubmitting} required>
                <Input name="lastname" placeholder="Dupont" autoComplete="family-name" useForm />
            </Field>

            {/* Email */}
            <Field name="email" label="Email" description="Entrez votre adresse email" disabled={isSubmitting} required>
                <Input name="email" type="email" placeholder="exemple@email.com" autoComplete="email" useForm />
            </Field>

            {/* Password */}
            <Field
                name="password"
                label="Mot de passe"
                description="Minimum 14 caractères"
                disabled={isSubmitting}
                required
            >
                <InputPassword name="password" placeholder="Minimum 8 caractères" autoComplete="new-password" useForm />
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

            {/* Captcha */}
            {captchaWidget}

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Déjà un compte ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* TODO: ajouter la <RequiredNote /> */}

            {/* Submit button */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    label="S'inscrire"
                    loading={isSubmitting}
                    disabled={!token}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
