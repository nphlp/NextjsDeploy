"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import InputPassword from "@comps/UI/inputPassword";
import { resetPassword } from "@lib/authClient";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ResetPasswordFormProps = {
    token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setIsFeedbackOpen(false);

        if (!password || !confirmPassword) {
            setFeedback({
                message: "Veuillez remplir tous les champs.",
                mode: "warning",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setFeedback({
                message: "Les mots de passe ne correspondent pas.",
                mode: "warning",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        const { data } = await resetPassword({
            newPassword: password,
            token,
        });

        if (!data) {
            setFeedback({
                message: "Erreur lors de la réinitialisation...",
                mode: "error",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        setFeedback({
            message: "Mot de passe réinitialisé avec succès !",
            mode: "success",
        });
        setIsFeedbackOpen(true);

        setTimeout(() => {
            router.push("/login");
        }, 1000);
    };

    return (
        <form onSubmit={handleResetPassword} className="space-y-4">
            <InputPassword
                label="Nouveau mot de passe"
                setValue={setPassword}
                value={password}
                autoComplete="new-password"
            />

            <InputPassword
                label="Confirmer le mot de passe"
                setValue={setConfirmPassword}
                value={confirmPassword}
                autoComplete="new-password"
            />

            <div className="text-gray-middle flex justify-center gap-2 text-sm">
                <p>Mot de passe retrouvé ?</p>
                <Link label="Se connecter" href="/login" variant="underline" />
            </div>

            <Feedback feedback={feedback} isFeedbackOpen={isFeedbackOpen} />

            <div className="flex justify-center">
                <Button type="submit" label="Réinitialiser" isLoading={isLoading} />
            </div>
        </form>
    );
}
