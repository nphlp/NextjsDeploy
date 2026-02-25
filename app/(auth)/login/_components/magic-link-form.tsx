"use client";

import { queryUrlSerializer } from "@app/(auth)/register/success/_lib/query-params";
import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { authClient } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function MagicLinkForm() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        email: {
            schema: emailSchema,
            onChangeSchema: emailSchemaProgressive,
            onBlurSchema: z.string(),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { email } = values;

        const { error } = await authClient.signIn.magicLink({ email });

        if (error) {
            toast.add({ title: "Erreur", description: "Impossible d'envoyer le lien magique.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        setTimeout(() => {
            reset();
            setIsSubmitting(false);
        }, 1000);

        router.push(queryUrlSerializer("/login/success", { email }));
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
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

            <div className="flex justify-center">
                <Button type="submit" label="Envoyer le lien" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
