"use client";

import Button from "@atoms/button";
import { FormCheckbox, FormInput, FormInputPassword } from "@atoms/form/_adapters";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import { useToast } from "@atoms/toast";
import { timeout } from "@utils/timout";
import { useState } from "react";
import { z } from "zod";

export default function FormLogin() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

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
        rememberMe: {
            schema: z.boolean(),
            setter: (value: boolean) => value,
            defaultValue: false,
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        // Validation
        const values = submit();

        // Cancel if validation fails
        if (!values) return;

        // Set loader after validation
        setIsLoading(true);

        try {
            // Async submission
            await timeout(1000);

            // Toast success
            toast.add({
                title: "Login",
                description: `Email: ${values.email}, Remember: ${values.rememberMe}`,
                type: "success",
            });

            // Redirect if needed
            // router.push("/");

            // Reset form
            reset();
        } catch {
            // Toast error
            toast.add({
                title: "Erreur",
                description: "Identifiants incorrects.",
                type: "error",
            });
        }

        // Stop loader
        setIsLoading(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <Field name="email" label="Email" description="Validation progressive" disabled={isLoading} required>
                <FormInput name="email" type="email" placeholder="john@example.com" autoComplete="email" />
            </Field>

            <Field name="password" label="Mot de passe" description="Requis" disabled={isLoading} required>
                <FormInputPassword name="password" placeholder="Votre mot de passe" autoComplete="current-password" />
            </Field>

            <Field name="rememberMe" disabled={isLoading}>
                <FormCheckbox name="rememberMe" label="Se souvenir de moi" />
            </Field>

            <div className="flex justify-center">
                <Button type="submit" label="Connexion" colors="solid" loading={isLoading} className="w-full" />
            </div>
        </Form>
    );
}
