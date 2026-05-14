"use client";

import Input from "@atoms/input/input";
import InputOtp from "@atoms/input/input-otp";
import InputPassword from "@atoms/input/input-password";
import PasswordStrength from "@atoms/input/password-strength";
import TextArea from "@atoms/input/text-area";
import { useToast } from "@atoms/toast";
import { useState } from "react";

/**
 * Input variants — Input, InputPassword, InputOtp, PasswordStrength,
 * TextArea. All are uncontrolled here (managed locally) so the demo is
 * interactive without form wiring.
 */
export default function InputDemo() {
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const toast = useToast();

    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            <div className="space-y-1">
                <p className="text-sm text-gray-500">Input</p>
                <Input placeholder="Votre nom" />
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-500">Input Password</p>
                <InputPassword
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-500">Password Strength</p>
                <PasswordStrength password={password} />
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-500">Input Otp</p>
                <InputOtp
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={(code) => toast.add({ title: "Code complet", description: code, type: "success" })}
                />
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-500">Text Area</p>
                <TextArea placeholder="Quelques mots..." />
            </div>
        </div>
    );
}
