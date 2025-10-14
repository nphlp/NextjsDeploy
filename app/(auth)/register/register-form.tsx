"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import Input from "@comps/UI/input/input";
import InputPassword from "@comps/UI/inputPassword";
import { signUp } from "@lib/authClient";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UpdateLastnameAction } from "@/actions/UpdateLastnameAction";

export default function RegisterForm() {
    const router = useRouter();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setIsFeedbackOpen(false);

        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            setFeedback({
                message: "Please fill all fields.",
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

        const { data } = await signUp.email({
            name: firstname,
            email,
            password,
        });

        if (!data) {
            setFeedback({
                message: "Failed to login, invalid credentials.",
                mode: "error",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        await UpdateLastnameAction({ lastname });

        router.push("/task");
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <Input
                label="Prénom"
                type="text"
                setValue={setFirstname}
                value={firstname}
                autoComplete="given-name"
                autoFocus
            />

            <Input label="Nom" type="text" setValue={setLastname} value={lastname} autoComplete="family-name" />

            <Input label="Email" type="email" setValue={setEmail} value={email} autoComplete="email" />

            <InputPassword label="Mot de passe" setValue={setPassword} value={password} autoComplete="new-password" />

            <InputPassword
                label="Confirmation mot de passe"
                setValue={setConfirmPassword}
                value={confirmPassword}
                autoComplete="new-password"
            />

            <div className="text-gray-middle flex justify-center gap-2 text-sm">
                <p>Déjà un compte ?</p>
                <Link label="Se connecter" href="/login" variant="underline" />
            </div>

            <Feedback feedback={feedback} isFeedbackOpen={isFeedbackOpen} />

            <div className="flex justify-center">
                <Button type="submit" label="S'inscrire" isLoading={isLoading} />
            </div>
        </form>
    );
}
