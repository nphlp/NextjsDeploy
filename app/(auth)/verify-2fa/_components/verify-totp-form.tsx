"use client";

import { useForm } from "@atoms/form/use-form";
import InputOtp from "@atoms/input/input-otp";
import { useToast } from "@atoms/toast";
import { twoFactor } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useQueryParams } from "../../_lib/use-query-params";

type VerifyTotpFormProps = {
    trustDevice: boolean;
};

export default function VerifyTotpForm(props: VerifyTotpFormProps) {
    const { trustDevice } = props;

    const router = useRouter();
    const toast = useToast();
    const { redirect } = useQueryParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { states, setStates, reset } = useForm({
        code: {
            schema: z.string().length(6, "Le code doit contenir 6 chiffres"),
            setter: (value: string) => value.replace(/\D/g, "").slice(0, 6),
            defaultValue: "",
        },
    });

    const handleComplete = async (completedCode: string) => {
        // Set loader
        setIsSubmitting(true);

        try {
            // Async submission
            const { error } = await twoFactor.verifyTotp({
                code: completedCode,
                trustDevice,
            });

            if (error) {
                // Toast error
                toast.add({
                    title: "Code invalide",
                    description: "Vérifiez votre application d'authentification.",
                    type: "error",
                });
                setStates.code("");
                setIsSubmitting(false);
                return;
            }

            // Toast success
            toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

            // Reset form (delayed to avoid visible field clearing)
            setTimeout(() => {
                reset();
                setIsSubmitting(false);
            }, 1000);

            // Redirect
            setTimeout(() => router.push(redirect || "/"), 500);
        } catch {
            // Toast error
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">
                Entrez le code à 6 chiffres de votre application d&apos;authentification.
            </p>
            <InputOtp
                value={states.code}
                onChange={setStates.code}
                onComplete={handleComplete}
                disabled={isSubmitting}
            />
        </div>
    );
}
