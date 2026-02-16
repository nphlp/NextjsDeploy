"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { twoFactor } from "@lib/auth-client";
import { useState } from "react";
import { z } from "zod";

export default function BackupCodesSection() {
    const toast = useToast();
    const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        password: {
            schema: z.string().min(1, "Le mot de passe est requis"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleRegenerate: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { data, error } = await twoFactor.generateBackupCodes({
            password: values.password,
        });

        if (error || !data) {
            toast.add({ title: "Erreur", description: "Mot de passe incorrect.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        setBackupCodes(data.backupCodes);
        setShowPasswordForm(false);
        setIsSubmitting(false);
        reset();
        toast.add({
            title: "Codes régénérés",
            description: "Les anciens codes ne sont plus valides.",
            type: "success",
        });
    };

    return (
        <section className="space-y-3">
            <div>
                <p className="font-medium">Codes de secours</p>
                <p className="text-sm text-gray-600">
                    Régénérez vos codes de secours si vous les avez perdus. Les anciens codes seront invalidés.
                </p>
            </div>

            {/* Display backup codes */}
            {backupCodes && (
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    {backupCodes.map((code) => (
                        <code key={code} className="text-center font-mono text-sm">
                            {code}
                        </code>
                    ))}
                </div>
            )}

            {/* Password form for regeneration */}
            {showPasswordForm ? (
                <Form register={register} onSubmit={handleRegenerate}>
                    <Field
                        name="password"
                        label="Mot de passe"
                        description="Confirmez votre mot de passe"
                        disabled={isSubmitting}
                        required
                    >
                        <InputPassword
                            name="password"
                            placeholder="Votre mot de passe"
                            autoComplete="current-password"
                            autoFocus
                            useForm
                        />
                    </Field>
                    <div className="flex gap-2">
                        <Button
                            label="Annuler"
                            onClick={() => {
                                setShowPasswordForm(false);
                                setBackupCodes(null);
                                reset();
                            }}
                            colors="ghost"
                        />
                        <Button type="submit" label="Régénérer" loading={isSubmitting} colors="destructive" />
                    </div>
                </Form>
            ) : (
                <Button label="Régénérer les codes" onClick={() => setShowPasswordForm(true)} colors="outline" />
            )}
        </section>
    );
}
