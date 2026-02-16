"use client";

import { Root as AlertDialogRoot, Backdrop, Close, Description, Popup, Portal, Title } from "@atoms/alert-dialog";
import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import InputOtp from "@atoms/input/input-otp";
import InputPassword from "@atoms/input/input-password";
import Switch, { Thumb } from "@atoms/switch";
import { useToast } from "@atoms/toast";
import { twoFactor } from "@lib/auth-client";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { z } from "zod";

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

type Step =
    | "idle"
    | "enable-password"
    | "setup"
    | "backup-codes"
    | "disable-password"
    | "regenerate-password"
    | "regenerate-codes";

export default function TotpSection(props: TotpSectionProps) {
    const { twoFactorEnabled, onStatusChange } = props;

    const toast = useToast();
    const [step, setStep] = useState<Step>("idle");
    const [totpUri, setTotpUri] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [switchChecked, setSwitchChecked] = useState(twoFactorEnabled);

    const resetState = () => {
        setStep("idle");
        setTotpUri("");
        setBackupCodes([]);
        setIsSubmitting(false);
        setOtpCode("");
        setAlertOpen(false);
    };

    const cancelFlow = () => {
        setSwitchChecked(twoFactorEnabled);
        resetState();
    };

    const handleSwitchChange = (checked: boolean) => {
        setSwitchChecked(checked);
        setStep(checked ? "enable-password" : "disable-password");
    };

    const handleEnable = async (password: string) => {
        setIsSubmitting(true);
        const { data, error } = await twoFactor.enable({ password });
        if (error || !data) {
            toast.add({ title: "Erreur", description: "Mot de passe incorrect.", type: "error" });
            setIsSubmitting(false);
            return;
        }
        setTotpUri(data.totpURI);
        setBackupCodes(data.backupCodes);
        setStep("setup");
        setIsSubmitting(false);
    };

    const handleVerifyTotp = async (code: string) => {
        setIsSubmitting(true);
        const { error } = await twoFactor.verifyTotp({ code });
        if (error) {
            toast.add({ title: "Code invalide", description: "Vérifiez votre application.", type: "error" });
            setOtpCode("");
            setIsSubmitting(false);
            return;
        }
        toast.add({ title: "2FA activé", type: "success" });
        setStep("backup-codes");
        setIsSubmitting(false);
        onStatusChange();
    };

    const handleDisable = async (password: string) => {
        setIsSubmitting(true);
        const { error } = await twoFactor.disable({ password });
        if (error) {
            toast.add({ title: "Erreur", description: "Mot de passe incorrect.", type: "error" });
            setIsSubmitting(false);
            return;
        }
        toast.add({ title: "2FA désactivé", type: "success" });
        resetState();
        onStatusChange();
    };

    const handleRegenerate = async (password: string) => {
        setIsSubmitting(true);
        const { data, error } = await twoFactor.generateBackupCodes({ password });
        if (error || !data) {
            toast.add({ title: "Erreur", description: "Mot de passe incorrect.", type: "error" });
            setIsSubmitting(false);
            return;
        }
        setBackupCodes(data.backupCodes);
        setStep("regenerate-codes");
        setIsSubmitting(false);
        toast.add({
            title: "Codes régénérés",
            description: "Les anciens codes ne sont plus valides.",
            type: "success",
        });
    };

    const secret = extractSecret(totpUri);

    return (
        <section className="space-y-4">
            {/* Header with Switch */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-medium">Authentification à deux facteurs (TOTP)</p>
                    <p className="text-sm text-gray-600">
                        Protégez votre compte avec une application d&apos;authentification.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`text-sm font-medium ${
                            step !== "idle" ? "text-amber-700" : switchChecked ? "text-green-800" : "text-red-700"
                        }`}
                    >
                        {step !== "idle" ? "En cours" : switchChecked ? "Activé" : "Inactif"}
                    </span>
                    <Switch
                        checked={switchChecked}
                        onCheckedChange={handleSwitchChange}
                        disabled={step !== "idle"}
                        className={
                            step !== "idle"
                                ? "border-amber-500 bg-amber-500 data-checked:border-amber-500 data-checked:bg-amber-500"
                                : switchChecked
                                  ? "border-green-700 bg-green-700 data-checked:border-green-700 data-checked:bg-green-700"
                                  : "border-red-700 bg-red-700 data-checked:border-red-700 data-checked:bg-red-700"
                        }
                    >
                        <Thumb />
                    </Switch>
                </div>
            </div>

            {/* Enable flow: password step */}
            {step === "enable-password" && (
                <PasswordForm
                    title="Confirmez votre mot de passe pour activer la 2FA."
                    onSubmit={handleEnable}
                    onCancel={cancelFlow}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Enable flow: QR code + OTP verification */}
            {step === "setup" && (
                <div className="space-y-4">
                    {/* Step 1: QR code + secret */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Étape 1 — Scanner le QR code</p>
                        <p className="text-sm text-gray-500">
                            Scannez ce QR code avec votre application Authenticator (Google Authenticator, Proton Pass,
                            etc.) ou copiez la clé manuellement dans votre gestionnaire de mots de passe.
                        </p>
                        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex justify-center">
                                <QRCodeSVG value={totpUri} size={200} />
                            </div>
                            {secret && <CopyableSecret secret={secret} />}
                        </div>
                    </div>

                    {/* Step 2: OTP verification */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Étape 2 — Vérifier le code</p>
                        <p className="text-sm text-gray-500">
                            Saisissez le code à 6 chiffres affiché dans votre application pour terminer
                            l&apos;enregistrement.
                        </p>
                        <div className="flex justify-center pt-1">
                            <InputOtp
                                value={otpCode}
                                onChange={setOtpCode}
                                onComplete={handleVerifyTotp}
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="text-center text-xs text-gray-400">
                            Le code se renouvelle toutes les 30 secondes.
                        </p>
                    </div>
                </div>
            )}

            {/* Enable flow: backup codes + confirmation */}
            {step === "backup-codes" && (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        Conservez ces codes en lieu sûr. Chaque code ne peut être utilisé qu&apos;une seule fois.
                    </p>
                    <BackupCodesGrid codes={backupCodes} />
                    <div>
                        <p className="text-center text-xs text-gray-400">
                            Assurez-vous d&apos;avoir bien enregistré vos codes de secours. Vous ne pourrez plus les
                            consulter après cette étape.
                        </p>
                        <p className="text-center text-xs text-gray-400">
                            De nouveaux codes peuvent être générés à tout moment en cas de perte.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Button label="Terminer" onClick={() => setAlertOpen(true)} />
                    </div>
                    <AlertDialogRoot open={alertOpen} onOpenChange={setAlertOpen}>
                        <Portal>
                            <Backdrop />
                            <Popup>
                                <Title>Confirmer</Title>
                                <Description>
                                    Vous ne pourrez plus les consulter après cette étape. De nouveaux codes peuvent être
                                    générés à tout moment en cas de perte.
                                </Description>
                                <div className="flex justify-end gap-4">
                                    <Close>Annuler</Close>
                                    <Close
                                        onClick={resetState}
                                        className="border-gray-950 bg-gray-950 text-gray-100 hover:border-gray-900 hover:bg-gray-900 active:border-gray-800 active:bg-gray-800"
                                    >
                                        Confirmer
                                    </Close>
                                </div>
                            </Popup>
                        </Portal>
                    </AlertDialogRoot>
                </div>
            )}

            {/* Disable flow: password step */}
            {step === "disable-password" && (
                <PasswordForm
                    title="Confirmez votre mot de passe pour désactiver la 2FA."
                    onSubmit={handleDisable}
                    onCancel={cancelFlow}
                    isSubmitting={isSubmitting}
                    submitLabel="Désactiver"
                    submitColors="destructive"
                />
            )}

            {/* Active state: regenerate section */}
            {step === "idle" && twoFactorEnabled && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Codes de secours</p>
                    <p className="text-sm text-gray-500">
                        Régénérez vos codes de secours si vous les avez perdus ou utilisés. Les anciens codes seront
                        invalidés.
                    </p>
                    <Button
                        label="Régénérer mes codes de secours"
                        onClick={() => setStep("regenerate-password")}
                        colors="outline"
                    />
                </div>
            )}

            {/* Regenerate flow: password step */}
            {step === "regenerate-password" && (
                <PasswordForm
                    title="Confirmez votre mot de passe pour régénérer vos codes de secours."
                    onSubmit={handleRegenerate}
                    onCancel={cancelFlow}
                    isSubmitting={isSubmitting}
                    submitLabel="Régénérer"
                    submitColors="destructive"
                />
            )}

            {/* Regenerate flow: new codes display */}
            {step === "regenerate-codes" && (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        Vos nouveaux codes de secours. Les anciens codes ne sont plus valides.
                    </p>
                    <BackupCodesGrid codes={backupCodes} />
                    <p className="text-center text-xs text-gray-400">
                        Assurez-vous d&apos;avoir bien enregistré vos nouveaux codes de secours avant de continuer.
                    </p>
                    <div className="flex justify-center">
                        <Button label="Terminé" onClick={() => setAlertOpen(true)} />
                    </div>
                    <AlertDialogRoot open={alertOpen} onOpenChange={setAlertOpen}>
                        <Portal>
                            <Backdrop />
                            <Popup>
                                <Title>Confirmer</Title>
                                <Description>
                                    Avez-vous bien enregistré vos nouveaux codes ? Vous ne pourrez plus les consulter
                                    après cette étape.
                                </Description>
                                <div className="flex justify-end gap-4">
                                    <Close>Annuler</Close>
                                    <Close
                                        onClick={resetState}
                                        className="border-gray-950 bg-gray-950 text-gray-100 hover:border-gray-900 hover:bg-gray-900 active:border-gray-800 active:bg-gray-800"
                                    >
                                        Confirmer
                                    </Close>
                                </div>
                            </Popup>
                        </Portal>
                    </AlertDialogRoot>
                </div>
            )}
        </section>
    );
}

// ----- Sub-components ----- //

type PasswordFormProps = {
    title: string;
    onSubmit: (password: string) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    submitLabel?: string;
    submitColors?: "default" | "destructive";
};

function PasswordForm(props: PasswordFormProps) {
    const { title, onSubmit, onCancel, isSubmitting, submitLabel = "Confirmer", submitColors = "default" } = props;

    const { register, submit } = useForm({
        password: {
            schema: z.string().min(1, "Le mot de passe est requis"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();
        const values = submit();
        if (!values) return;
        await onSubmit(values.password);
    };

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-600">{title}</p>
            <Form register={register} onSubmit={handleSubmit}>
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
                    <Button label="Annuler" onClick={onCancel} colors="ghost" />
                    <Button type="submit" label={submitLabel} loading={isSubmitting} colors={submitColors} />
                </div>
            </Form>
        </div>
    );
}

function BackupCodesGrid({ codes }: { codes: string[] }) {
    return (
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {codes.map((code) => (
                <code key={code} className="text-center font-mono text-sm">
                    {code}
                </code>
            ))}
        </div>
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
