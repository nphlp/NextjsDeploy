"use client";

import Button, { Link } from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { authClient } from "@lib/auth-client";
import { getEmailProvider } from "@utils/email-providers";
import { ExternalLink } from "lucide-react";
import { Route } from "next";
import { useState } from "react";
import z from "zod";

export default function MagicLinkForm() {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sentEmail, setSentEmail] = useState<string | null>(null);

    const { register, submit } = useForm({
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

        const { error } = await authClient.signIn.magicLink({
            email: values.email,
            callbackURL: "/",
        });

        if (error) {
            toast.add({ title: "Erreur", description: "Impossible d'envoyer le lien magique.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        setSentEmail(values.email);
        setIsSubmitting(false);
    };

    if (sentEmail) {
        const provider = getEmailProvider(sentEmail);

        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm text-gray-600">
                    Un lien de connexion a &eacute;t&eacute; envoy&eacute; &agrave; votre adresse email.
                </p>
                {provider ? (
                    <Link
                        href={provider.url as Route}
                        label={`Ouvrir ${provider.name}`}
                        colors="outline"
                        className="w-full text-gray-700"
                        legacyProps={{ target: "_blank" }}
                    >
                        Ouvrir {provider.name}
                        <ExternalLink className="size-4" />
                    </Link>
                ) : (
                    <p className="text-center text-sm text-gray-400">
                        V&eacute;rifiez votre bo&icirc;te de r&eacute;ception.
                    </p>
                )}
            </div>
        );
    }

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
