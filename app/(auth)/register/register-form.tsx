"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Input from "@comps/UI/input/input";
import InputPassword from "@comps/UI/inputPassword";
import { useState } from "react";

export default function LoginForm() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <form action="" className="space-y-4">
            <Input label="Prénom" type="text" setValue={setFirstname} value={firstname} autoComplete="name" autoFocus />
            <Input label="Nom" type="text" setValue={setLastname} value={lastname} autoComplete="family-name" />
            <Input label="Email" type="email" setValue={setEmail} value={email} autoComplete="email" />
            <InputPassword label="Mot de passe" setValue={setPassword} value={password} autoComplete="new-password" />
            <InputPassword
                label="Confirmation mot de passe"
                setValue={setConfirmPassword}
                value={confirmPassword}
                autoComplete="new-password"
            />
            <div className="flex justify-center">
                <Button type="submit" label="S'inscrire" />
            </div>
            <div className="text-gray-middle flex justify-center gap-2 text-sm">
                <p>Déjà un compte ?</p>
                <Link label="Se connecter" href="/login" variant="underline" />
            </div>
        </form>
    );
}
