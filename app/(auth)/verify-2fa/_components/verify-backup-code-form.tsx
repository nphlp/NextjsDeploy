"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { twoFactor } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type VerifyBackupCodeFormProps = {
    trustDevice: boolean;
};

export default function VerifyBackupCodeForm(props: VerifyBackupCodeFormProps) {
    const { trustDevice } = props;

    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        code: {
            schema: z.string().min(1, "Le code est requis"),
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { error } = await twoFactor.verifyBackupCode({
            code: values.code,
            trustDevice,
        });

        if (error) {
            toast.add({ title: "Code invalide", description: "Vérifiez votre code de secours.", type: "error" });
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
            <p className="text-sm text-gray-600">Entrez l&apos;un de vos codes de secours.</p>
            <Field
                name="code"
                label="Code de secours"
                description="Code à usage unique"
                disabled={isSubmitting}
                required
            >
                <Input name="code" placeholder="XXXXXXXXXX" autoComplete="off" autoFocus useForm />
            </Field>
            <div className="flex justify-center">
                <Button type="submit" label="Vérifier" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
