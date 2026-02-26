"use client";

import CancelTwoFactorAction from "@actions/CancelTwoFactorAction";
import Button from "@atoms/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { queryUrlSerializer } from "../../_lib/query-params";
import { useQueryParams } from "../../_lib/use-query-params";
import VerifyBackupCodeForm from "./verify-backup-code-form";
import VerifyTotpForm from "./verify-totp-form";

type Method = "totp" | "backup-code";

export default function VerifyTwoFactorContent() {
    const router = useRouter();
    const { redirect } = useQueryParams();
    const [method, setMethod] = useState<Method>("totp");
    const [trustDevice, setTrustDevice] = useState(false);

    const handleCancel = async () => {
        await CancelTwoFactorAction();
        router.push(queryUrlSerializer("/login", { redirect }));
    };

    return (
        <>
            {/* Active verification form */}
            {method === "totp" && <VerifyTotpForm trustDevice={trustDevice} />}
            {method === "backup-code" && <VerifyBackupCodeForm trustDevice={trustDevice} />}

            {/* Trust device checkbox */}
            <label className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                    className="size-4 rounded border-gray-300"
                />
                Faire confiance à cet appareil (30 jours)
            </label>

            {/* Method switcher */}
            <div className="flex flex-col items-center gap-1">
                {method !== "totp" && (
                    <Button
                        label="Utiliser l'application d'authentification"
                        onClick={() => setMethod("totp")}
                        colors="link"
                        noStyle
                        className="text-xs text-gray-500 hover:underline"
                    />
                )}
                {method !== "backup-code" && (
                    <Button
                        label="Utiliser un code de secours"
                        onClick={() => setMethod("backup-code")}
                        colors="link"
                        noStyle
                        className="text-xs text-gray-500 hover:underline"
                    />
                )}
                <Button
                    label="Retour à la connexion"
                    onClick={handleCancel}
                    colors="link"
                    noStyle
                    className="text-xs text-gray-500 hover:underline"
                />
            </div>
        </>
    );
}
