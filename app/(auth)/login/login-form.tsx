"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Input from "@comps/UI/input/input";
import InputPassword from "@comps/UI/inputPassword";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form action="" className="space-y-4">
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
            <div className="flex justify-center">
                <Button type="submit" label="Connexion" />
            </div>
        </form>
    );
}
