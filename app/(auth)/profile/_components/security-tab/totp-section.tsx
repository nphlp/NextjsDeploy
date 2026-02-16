"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import InputOtp from "@atoms/input/input-otp";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { twoFactor } from "@lib/auth-client";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { z } from "zod";

/**
 * Extract the TOTP secret from an otpauth URI
 * e.g. otpauth://totp/Nextjs%20Deploy:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=...
 */
const extractSecret = (totpUri: string): string => {
    try {
        const url = new URL(totpUri);
        return url.searchParams.get("secret") ?? "";
    } catch {
        return "";
    }
};

type TotpSectionProps = {
    twoFactorEnabled: boolean;
    onStatusChange: () => void;
};

type Step = "idle" | "password" | "qr-code" | "verify" | "backup-codes";

export default function TotpSection(props: TotpSectionProps) {
    const { twoFactorEnabled, onStatusChange } = props;

    const toast = useToast();
    const [step, setStep] = useState<Step>("idle");
    const [totpUri, setTotpUri] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, states, setStates, submit, reset } = useForm({
        password: {
            schema: z.string().min(1, "Le mot de passe est requis"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        code: {
            schema: z.string().length(6, "Le code doit contenir 6 chiffres"),
            setter: (value: string) => value.replace(/\D/g, "").slice(0, 6),
            defaultValue: "",
        },
    });

    const handleEnable: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { data, error } = await twoFactor.enable({
            password: values.password,
        });

        if (error || !data) {
            toast.add({ title: "Erreur", description: "Mot de passe incorrect.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        setTotpUri(data.totpURI);
        setBackupCodes(data.backupCodes);
        setStep("qr-code");
        setIsSubmitting(false);
        reset();
    };

    const handleDisable: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { error } = await twoFactor.disable({
            password: values.password,
        });

        if (error) {
            toast.add({ title: "Erreur", description: "Mot de passe incorrect.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        toast.add({ title: "2FA désactivé", type: "success" });
        setStep("idle");
        setTotpUri("");
        setBackupCodes([]);
        setIsSubmitting(false);
        reset();
        onStatusChange();
    };

    const handleVerifyTotp = async (code: string) => {
        setIsSubmitting(true);

        const { error } = await twoFactor.verifyTotp({ code });

        if (error) {
            toast.add({ title: "Code invalide", description: "Vérifiez votre application.", type: "error" });
            setStates.code("");
            setIsSubmitting(false);
            return;
        }

        toast.add({ title: "2FA activé", description: "Conservez vos codes de secours en lieu sûr.", type: "success" });
        reset();
        setStep("backup-codes");
        setIsSubmitting(false);
        onStatusChange();
    };

    // Idle state
    if (step === "idle") {
        return (
            <section className="space-y-3">
                <div>
                    <p className="font-medium">Authentification à deux facteurs (TOTP)</p>
                    <p className="text-sm text-gray-600">
                        {twoFactorEnabled
                            ? "La 2FA est activée. Vous devrez saisir un code à chaque connexion."
                            : "Protégez votre compte avec une application d'authentification."}
                    </p>
                </div>
                <Button
                    label={twoFactorEnabled ? "Désactiver la 2FA" : "Activer la 2FA"}
                    onClick={() => setStep("password")}
                    colors={twoFactorEnabled ? "destructive" : "default"}
                />
            </section>
        );
    }

    // Password step (enable or disable)
    if (step === "password") {
        return (
            <section className="space-y-3">
                <div>
                    <p className="font-medium">{twoFactorEnabled ? "Désactiver la 2FA" : "Activer la 2FA"}</p>
                    <p className="text-sm text-gray-600">Confirmez votre mot de passe pour continuer.</p>
                </div>
                <Form register={register} onSubmit={twoFactorEnabled ? handleDisable : handleEnable}>
                    <Field
                        name="password"
                        label="Mot de passe"
                        description="Votre mot de passe actuel"
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
                                setStep("idle");
                                setTotpUri("");
                                setBackupCodes([]);
                                reset();
                            }}
                            colors="ghost"
                        />
                        <Button type="submit" label="Confirmer" loading={isSubmitting} />
                    </div>
                </Form>
            </section>
        );
    }

    // QR code step
    if (step === "qr-code") {
        const secret = extractSecret(totpUri);

        return (
            <section className="space-y-3">
                <div>
                    <p className="font-medium">Scanner le QR code</p>
                    <p className="text-sm text-gray-600">
                        Scannez ce QR code avec votre application d&apos;authentification, ou copiez la clé
                        manuellement.
                    </p>
                </div>
                <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-4">
                    <QRCodeSVG value={totpUri} size={200} />
                </div>
                {secret && <CopyableSecret secret={secret} />}
                <Button label="Suivant" onClick={() => setStep("verify")} />
            </section>
        );
    }

    // Verify TOTP step
    if (step === "verify") {
        return (
            <section className="space-y-3">
                <div>
                    <p className="font-medium">Vérifier le code</p>
                    <p className="text-sm text-gray-600">Entrez le code à 6 chiffres affiché dans votre application.</p>
                </div>
                <div className="flex justify-center">
                    <InputOtp
                        value={states.code}
                        onChange={setStates.code}
                        onComplete={handleVerifyTotp}
                        disabled={isSubmitting}
                    />
                </div>
            </section>
        );
    }

    // Backup codes step
    return (
        <section className="space-y-3">
            <div>
                <p className="font-medium">Codes de secours</p>
                <p className="text-sm text-gray-600">
                    Conservez ces codes en lieu sûr. Chaque code ne peut être utilisé qu&apos;une seule fois.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                {backupCodes.map((code) => (
                    <code key={code} className="text-center font-mono text-sm">
                        {code}
                    </code>
                ))}
            </div>
            <Button
                label="Terminé"
                onClick={() => {
                    setStep("idle");
                    setTotpUri("");
                    setBackupCodes([]);
                }}
            />
        </section>
    );
}

function CopyableSecret({ secret }: { secret: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <code className="flex-1 text-center font-mono text-sm break-all select-all">{secret}</code>
            <Button label="Copier la clé" onClick={handleCopy} noStyle className="text-gray-400 hover:text-gray-700">
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            </Button>
        </div>
    );
}
