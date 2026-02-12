"use client";

import cn from "@lib/cn";
import { Check, X } from "lucide-react";

type PasswordStrengthProps = {
    password: string;
};

const rules = [
    { label: "14 caractères minimum", test: (p: string) => p.length >= 14 },
    { label: "1 majuscule", test: (p: string) => /[A-Z]/.test(p) },
    { label: "1 minuscule", test: (p: string) => /[a-z]/.test(p) },
    { label: "1 caractère spécial", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
    { label: "1 nombre", test: (p: string) => /\d/.test(p) },
];

const getScore = (password: string) => {
    const lengthScore = Math.min(password.length, 14);
    const hasUpper = /[A-Z]/.test(password) ? 1 : 0;
    const hasLower = /[a-z]/.test(password) ? 1 : 0;
    const hasNumber = /\d/.test(password) ? 1 : 0;
    const hasSpecial = /[^a-zA-Z0-9]/.test(password) ? 1 : 0;
    return lengthScore + hasUpper + hasLower + hasNumber + hasSpecial;
};

const getBarColor = (percentage: number) => {
    if (percentage <= 40) return "bg-red-500";
    if (percentage <= 75) return "bg-orange-400";
    return "bg-green-500";
};

export default function PasswordStrength(props: PasswordStrengthProps) {
    const { password } = props;

    const score = getScore(password);
    const percentage = Math.round((score / 18) * 100);

    return (
        <div className="space-y-2">
            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className={cn("h-full rounded-full transition-all duration-300", getBarColor(percentage))}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Checklist */}
            <div className="flex flex-col gap-0.5">
                {rules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                        <div key={rule.label} className="flex items-center gap-1.5">
                            {passed ? (
                                <Check className="size-3.5 text-green-600" />
                            ) : (
                                <X className="size-3.5 text-gray-400" />
                            )}
                            <span className={cn("text-xs", passed ? "text-green-600" : "text-gray-500")}>
                                {rule.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
