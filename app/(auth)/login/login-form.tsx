"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import Input from "@comps/UI/input/input";
import InputPassword from "@comps/UI/inputPassword";
import { signIn } from "@lib/authClient";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setIsFeedbackOpen(false);

        if (!email || !password) {
            setFeedback({
                message: "Please fill all fields.",
                mode: "warning",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        const { data, error } = await signIn.email({
            email,
            password,
        });

        if (!data || error) {
            setFeedback({
                message: "Failed to login, invalid credentials.",
                mode: "error",
            });
            setIsFeedbackOpen(true);
            setIsLoading(false);
            return;
        }

        router.push("/task");
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" setValue={setEmail} value={email} autoComplete="email" autoFocus />

            <div className="flex flex-col items-end gap-2">
                <InputPassword
                    label="Mot de passe"
                    setValue={setPassword}
                    value={password}
                    autoComplete="current-password"
                    className={{ component: "w-full" }}
                />
                <Link
                    label="Mot de passe oublié ?"
                    href="/reset-password"
                    variant="underline"
                    className="text-gray-middle text-xs"
                />
            </div>

            <div className="text-gray-middle flex justify-center gap-2 text-sm">
                <p>Pas encore de compte ?</p>
                <Link label="S'inscrire" href="/register" variant="underline" />
            </div>

            <Feedback feedback={feedback} isFeedbackOpen={isFeedbackOpen} />

            <div className="flex justify-center">
                <Button type="submit" label="Connexion" isLoading={isLoading} />
            </div>
        </form>
    );
}
