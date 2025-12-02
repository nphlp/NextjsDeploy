"use client";

import { Input } from "@shadcn/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";

export type PasswordInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function PasswordInput(props: PasswordInputProps) {
    const { ...others } = props;

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input type={showPassword ? "text" : "password"} {...others} />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
                {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
        </div>
    );
}
