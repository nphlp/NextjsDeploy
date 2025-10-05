"use client";

import Button from "@comps/UI/button/button";
import Link from "@comps/UI/button/link";
import Input from "@comps/UI/input/input";
import { useState } from "react";

export default function ResetForm() {
    const [email, setEmail] = useState("");

    return (
        <form action="" className="space-y-4">
            <Input label="Email" type="email" setValue={setEmail} value={email} autoComplete="email" autoFocus />
            <div className="text-gray-middle flex justify-center gap-2 text-sm">
                <p>Mot de passe retrouvé ?</p>
                <Link label="Se connecter" href="/login" variant="underline" />
            </div>
            <div className="flex justify-center">
                <Button type="submit" label="Connexion" />
            </div>
        </form>
    );
}
