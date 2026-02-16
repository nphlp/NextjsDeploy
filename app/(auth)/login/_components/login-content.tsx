"use client";

import Button from "@atoms/button";
import { useToast } from "@atoms/toast";
import { signIn } from "@lib/auth-client";
import { Fingerprint, KeyRound, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginForm from "./login-form";
import MagicLinkForm from "./magic-link-form";

type Method = "credentials" | "magic-link";

const headers = {
    credentials: {
        title: "Connexion",
        description: "Saisissez vos identifiants de connexion.",
    },
    "magic-link": {
        title: "Lien magique",
        description: "Recevez un lien de connexion par email.",
    },
};

export default function LoginContent() {
    const router = useRouter();
    const toast = useToast();
    const [method, setMethod] = useState<Method>("credentials");
    const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

    const { title, description } = headers[method];

    const handlePasskeyLogin = async () => {
        setIsPasskeyLoading(true);

        const { error } = await signIn.passkey();

        if (error) {
            toast.add({ title: "Échec de la connexion", description: "Passkey non reconnu.", type: "error" });
            setIsPasskeyLoading(false);
            return;
        }

        toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

        setTimeout(() => {
            setIsPasskeyLoading(false);
        }, 1000);

        router.push("/");
    };

    return (
        <>
            {/* Header */}
            <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            {/* Active form */}
            {method === "credentials" && <LoginForm />}
            {method === "magic-link" && <MagicLinkForm />}

            {/* Separator */}
            <div className="flex items-center gap-3">
                <hr className="h-px flex-1 border-gray-200" />
                <span className="text-xs text-gray-400">Options de connexion</span>
                <hr className="h-px flex-1 border-gray-200" />
            </div>

            {/* Alternative methods */}
            {method === "credentials" && (
                <Button
                    label="Magic Link"
                    onClick={() => setMethod("magic-link")}
                    colors="outline"
                    className="w-full text-xs"
                >
                    <WandSparkles className="size-4" />
                    Lien magique
                </Button>
            )}
            {method === "magic-link" && (
                <Button
                    label="Email & Password"
                    onClick={() => setMethod("credentials")}
                    colors="outline"
                    className="w-full text-xs"
                >
                    <KeyRound className="size-4" />
                    Email & Mot de passe
                </Button>
            )}
            <Button
                label="Passkey"
                onClick={handlePasskeyLogin}
                loading={isPasskeyLoading}
                colors="outline"
                className="w-full text-xs"
            >
                <Fingerprint className="size-4" />
                Clé d&apos;accès
            </Button>
        </>
    );
}
