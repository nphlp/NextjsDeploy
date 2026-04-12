"use client";

import { queryUrlSerializer } from "@app/(auth)/_lib/success-query-params";
import Form, { FormInput, OnSubmit, emailSchema, emailSchemaProgressive, useForm } from "@atoms/_form";
import Button from "@atoms/button";
import { useToast } from "@atoms/toast";
import { changeEmail } from "@lib/auth-client";
import { isValidationError, translateAuthError } from "@lib/auth-errors";
import { Session } from "@lib/auth-server";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type ChangeEmailSectionProps = {
    session: NonNullable<Session>;
    onStatusChange: () => void;
};

export default function ChangeEmailSection(props: ChangeEmailSectionProps) {
    const { session } = props;

    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        newEmail: {
            schema: emailSchema.refine(
                (val) => val.toLowerCase() !== session.user.email.toLowerCase(),
                "L'email doit être différent de l'actuel",
            ),
            onChangeSchema: emailSchemaProgressive,
            onBlurSchema: z.string(),
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

        try {
            // Async submission
            const { data, error } = await changeEmail({
                newEmail: validated.newEmail,
                callbackURL: "/profile?tab=security",
            });

            if (!data && isValidationError(error?.message)) {
                // Show real validation errors (same email, invalid domain)
                toast.add({
                    title: "Échec",
                    description: translateAuthError(error?.message),
                    type: "error",
                });
                setIsSubmitting(false);
                return;
            }

            // Reset form (delayed: SPA navigation can go back)
            setTimeout(() => {
                reset();
                setIsSubmitting(false);
            }, 1000);

            // Always redirect to success page (anti-enumeration: hide "email already in use")
            router.push(queryUrlSerializer("/profile/change-email/success", { email: validated.newEmail }));
        } catch {
            // Toast error
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Changer d&apos;adresse email</p>
                <p className="text-sm text-gray-600">
                    Adresse actuelle : <span className="font-medium">{session.user.email}</span>
                </p>
            </div>

            {/* New email */}
            <FormInput
                name="newEmail"
                label="Nouvelle adresse email"
                description="Un email de vérification sera envoyé à cette adresse"
                disabled={isSubmitting}
                required
                placeholder="nouvelle@email.com"
                type="email"
                autoComplete="email"
            />

            <div className="flex justify-center">
                <Button
                    type="submit"
                    label="Changer mon email"
                    colors="solid"
                    loading={isSubmitting}
                    className="w-full md:w-fit"
                />
            </div>
        </Form>
    );
}
