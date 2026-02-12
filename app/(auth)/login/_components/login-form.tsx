"use client";

import Button, { Link } from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { signIn } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function LoginForm() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        email: {
            schema: emailSchema,
            onChangeSchema: emailSchemaProgressive,
            setter: (value: string) => value,
            defaultValue: "",
        },
        password: {
            schema: z.string().min(1, "Le mot de passe est requis"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { data } = await signIn.email(values);

        if (!data) {
            toast.add({ title: "Échec de la connexion", description: "Identifiants invalides.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

        setTimeout(() => {
            reset();
            setIsSubmitting(false);
        }, 1000);

        router.push("/");
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Email */}
            <Field name="email" label="Email" description="Entrez votre adresse email" disabled={isSubmitting} required>
                <Input
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    autoFocus
                    useForm
                />
            </Field>

            {/* Password */}
            <Field
                name="password"
                label="Mot de passe"
                description="Entrez votre mot de passe"
                disabled={isSubmitting}
                required
            >
                <InputPassword
                    name="password"
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    useForm
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

            {/* Register link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Pas encore de compte ?</span>
                <Link href="/register" label="S'inscrire" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* TODO: ajouter la <RequiredNote /> */}

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Connexion" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
