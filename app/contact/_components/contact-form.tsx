"use client";

import SendContactAction from "@actions/send-contact";
import Form, {
    FormInput,
    FormSelect,
    FormTextArea,
    OnSubmit,
    emailSchema,
    emailSchemaProgressive,
    useForm,
} from "@atoms/_form";
import Button from "@atoms/button";
import {
    Icon,
    Item,
    ItemIndicator,
    ItemText,
    List,
    Popup,
    Portal,
    Positioner,
    Trigger,
    Value,
    renderValue,
} from "@atoms/select";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { useSession } from "@lib/auth-client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Subject, subjectLabels } from "../_lib/query-params";
import { useQueryParams } from "../_lib/use-query-params";

export default function ContactForm() {
    const toast = useToast();
    const { subject: defaultSubject, setSubject } = useQueryParams();
    const { data: session } = useSession();
    const { token, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();

    const isLoggedIn = !!session;
    const sessionEmail = session?.user?.email ?? "";

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { states, register, submit, reset } = useForm({
        subject: {
            schema: z.string("Sélectionnez un sujet"),
            setter: (value: Subject | null) => value,
            defaultValue: defaultSubject,
        },
        email: {
            schema: isLoggedIn ? z.string() : emailSchema,
            onChangeSchema: isLoggedIn ? z.string() : emailSchemaProgressive,
            onBlurSchema: z.string(),
            setter: (value: string) => value,
            defaultValue: sessionEmail,
        },
        message: {
            schema: z.string().min(10, "Minimum 10 caractères").max(2000, "Maximum 2000 caractères"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const validated = submit();
        if (!validated) return;

        setIsSubmitting(true);

        try {
            await SendContactAction({
                subject: subjectLabels[validated.subject as Subject] ?? validated.subject,
                message: validated.message,
                senderEmail: isLoggedIn ? sessionEmail : validated.email,
            });

            toast.add({
                title: "Message envoyé",
                description: "Nous reviendrons vers vous dès que possible.",
                type: "success",
            });

            reset();
            resetCaptcha();
        } catch {
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
        }

        setIsSubmitting(false);
    };

    // Sync subject with query params
    useEffect(() => {
        setSubject(states.subject);
    }, [states.subject, setSubject]);

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Subject */}
            <FormSelect
                name="subject"
                label="Sujet"
                description="Sélectionnez la catégorie de votre demande"
                disabled={isSubmitting}
                required
            >
                <Trigger className="w-full max-w-full">
                    <Value>
                        {(value) =>
                            renderValue({
                                value,
                                items: subjectLabels,
                                placeholder: "Choisir un sujet",
                            })
                        }
                    </Value>
                    <Icon />
                </Trigger>
                <Portal>
                    <Positioner>
                        <Popup>
                            <List>
                                <Item value={null}>
                                    <ItemIndicator />
                                    <ItemText>Choisir un sujet</ItemText>
                                </Item>
                                {Object.entries(subjectLabels).map(([key, label]) => (
                                    <Item key={key} value={key}>
                                        <ItemIndicator />
                                        <ItemText>{label}</ItemText>
                                    </Item>
                                ))}
                            </List>
                        </Popup>
                    </Positioner>
                </Portal>
            </FormSelect>

            {/* Email (only for non-logged-in users) */}
            {!isLoggedIn && (
                <FormInput
                    name="email"
                    label="Email"
                    description="Pour que nous puissions vous répondre"
                    disabled={isSubmitting}
                    required
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                />
            )}

            {/* Message */}
            <FormTextArea
                name="message"
                label="Message"
                description="Décrivez votre demande en détail"
                disabled={isSubmitting}
                required
                placeholder="Décrivez votre demande..."
                rows={3}
            />

            {/* Captcha */}
            {captchaWidget}

            {/* Submit */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    label="Envoyer"
                    colors="solid"
                    loading={isSubmitting}
                    disabled={!token}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}
