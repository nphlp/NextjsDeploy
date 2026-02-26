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
        setIsSubmitting(true);

        const { error } = await twoFactor.verifyTotp({
            code: completedCode,
            trustDevice,
        });

        if (error) {
            toast.add({
                title: "Code invalide",
                description: "Vérifiez votre application d'authentification.",
                type: "error",
            });
            setStates.code("");
            setIsSubmitting(false);
            return;
        }

        toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

        setTimeout(() => {
            reset();
            setIsSubmitting(false);
        }, 1000);

        setTimeout(() => router.push(redirect || "/"), 500);
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
