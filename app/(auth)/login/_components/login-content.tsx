"use client";

import Button from "@atoms/button";
import { useToast } from "@atoms/toast";
import { signIn } from "@lib/auth-client";
import { Fingerprint, KeyRound, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryParams } from "../../_lib/use-query-params";
import LoginForm from "./login-form";
import MagicLinkForm from "./magic-link-form";

type Method = "credentials" | "magic-link";

const headers = {
    credentials: {
        title: "Connexion",
        description: "Saisissez vos identifiants de connexion.",
    },
    "magic-link": {
        title: "Connexion par email",
        description: "Recevez un lien de connexion par email.",
    },
};

export default function LoginContent() {
    const router = useRouter();
    const toast = useToast();
    const { redirect } = useQueryParams();
    const [method, setMethod] = useState<Method>("credentials");
    const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

    const { title, description } = headers[method];

    const handlePasskeyLogin = async () => {
        // Set loader
        setIsPasskeyLoading(true);

        try {
            // Async submission
            const { error } = await signIn.passkey();

            if (error) {
                setIsPasskeyLoading(false);
                // Toast error
                toast.add({ title: "Échec de la connexion", description: "Passkey non reconnu.", type: "error" });
                return;
            }

            // Toast success
            toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

            // Stop loader (delayed to avoid visible state change)
            setTimeout(() => {
                setIsPasskeyLoading(false);
            }, 1000);

            // Redirect
            router.push(redirect || "/");
        } catch {
            // Toast error
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
            setIsPasskeyLoading(false);
        }
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
                    <Mail className="size-4" />
                    Connexion par email
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
