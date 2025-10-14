"use client";

import Button from "@comps/UI/button/button";
import Input from "@comps/UI/input/input";
import { FormEvent, useState } from "react";
import SendEmailAction from "@/actions/SendEmailAction";

export default function Send() {
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState<string>("0.0s");
    const [status, setStatus] = useState<string>("");

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.length) {
            setStatus("❌ Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        setStatus("Envoi en cours...");
        setTimer("0.0s");

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            setTimer(`${elapsed}s`);
        }, 100);

        try {
            await SendEmailAction({
                subject: `Test email`,
                email,
                body: (
                    <div>
                        <h1>This is a test email</h1>
                        <p>If you received this email, the email sending functionality works!</p>
                    </div>
                ),
            });
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
            setStatus(`✅ Email envoyé en ${totalTime}s`);
        } catch (error) {
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
            setStatus(`❌ Erreur après ${totalTime}s: ${(error as Error).message}`);
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSend} className="space-y-4">
                <Input
                    label="Email"
                    placeholder="Email"
                    autoComplete="email"
                    type="email"
                    setValue={setEmail}
                    value={email}
                    noLabel
                />
                <Button label="Send Email" type="submit" isLoading={isLoading} />
            </form>
            {isLoading && <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>⏱️ {timer}</div>}
            {status && <div style={{ fontSize: "0.9rem" }}>{status}</div>}
        </>
    );
}
