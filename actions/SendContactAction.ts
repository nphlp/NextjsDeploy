"use server";

import SendEmailAction from "@actions/SendEmailAction";
import EmailTemplate from "@comps/email-template";
import { NEXT_PUBLIC_BASE_URL, SMTP_FROM, SMTP_FROM_NAME, SUPPORT_EMAIL } from "@lib/env";
import NodemailerInstance from "@lib/nodemailer";
import { render } from "@react-email/render";
import ContactEmailTemplate from "@/components/email-contact";

type SendContactActionProps = {
    subject: string;
    message: string;
    senderEmail: string;
};

/**
 * Contact form handler
 * -> Called from client (contact form)
 * -> Sends message to SUPPORT_EMAIL + confirmation to sender
 * -> Uses ContactEmailTemplate (different layout than EmailTemplate)
 */
export default async function SendContactAction(props: SendContactActionProps) {
    const { subject, message, senderEmail } = props;

    try {
        const html = await render(ContactEmailTemplate({ subject, message, senderEmail }), { pretty: true });

        const success = await NodemailerInstance.sendMail({
            from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
            to: SUPPORT_EMAIL,
            replyTo: senderEmail,
            subject: `[Contact] ${subject}`,
            html,
        });

        // Send confirmation email to sender (fire-and-forget)
        void SendEmailAction({
            subject: "Votre message a bien été envoyé",
            email: senderEmail,
            body: EmailTemplate({
                buttonUrl: `${NEXT_PUBLIC_BASE_URL}`,
                emailType: "contact-confirmation",
            }),
        });

        return success;
    } catch (error) {
        console.error(`Failed to send contact email (from ${senderEmail}):`, error);
        throw new Error("Unable to send contact email -> " + (error as Error).message);
    }
}
