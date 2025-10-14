"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import Input from "@comps/UI/input/input";
import { forgetPassword } from "@lib/authClient";
import { FormEvent, useState } from "react";

export default function RequestResetForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleRequestReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setIsFeedbackOpen(false);

        if (!email) {
            setFeedback({
                message: "Veuillez saisir votre adresse email.",
                mode: "warning",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        const { data } = await forgetPassword({
            email,
            redirectTo: "/reset-password",
        });

        if (!data) {
            setFeedback({
                message: "Erreur lors de l'envoi de l'email...",
                mode: "error",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        setEmailSent(true);
        setFeedback({
            message: "Email de réinitialisation envoyé !",
            mode: "success",
        });
        setIsFeedbackOpen(true);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleRequestReset} className="space-y-4">
            <Input label="Email" type="email" setValue={setEmail} value={email} autoComplete="email" autoFocus />

            <div className="text-gray-middle flex justify-center gap-2 text-sm">
                <p>Mot de passe retrouvé ?</p>
                <Link label="Se connecter" href="/login" variant="underline" />
            </div>

            <Feedback feedback={feedback} isFeedbackOpen={isFeedbackOpen} />

            <div className="flex justify-center">
                <Button type="submit" label="Envoyer l'email" isLoading={isLoading} isDisabled={emailSent} />
            </div>
        </form>
    );
}
