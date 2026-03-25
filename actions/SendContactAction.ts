"use server";

import { IS_DEV, SMTP_FROM, SMTP_FROM_NAME, SUPPORT_EMAIL } from "@lib/env";
import NodemailerInstance from "@lib/nodemailer";
import { render } from "@react-email/render";
import ContactEmailTemplate from "@/components/email-contact";

type SendContactActionProps = {
    subject: string;
    message: string;
    senderEmail: string;
};

export default async function SendContactAction(props: SendContactActionProps) {
    const { subject, message, senderEmail } = props;

    try {
        const html = await render(ContactEmailTemplate({ subject, message, senderEmail }), {
            pretty: true,
        });

        if (IS_DEV) {
            console.log("📨 Sending contact email...");
        }

        const success = await NodemailerInstance.sendMail({
            from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
            to: SUPPORT_EMAIL,
            replyTo: senderEmail,
            subject: `[Contact] ${subject}`,
            html,
        });

        if (IS_DEV) {
            console.log(`✅ Contact email sent successfully (from ${senderEmail})`);
        }

        return success;
    } catch (error) {
        console.error(`❌ Failed to send contact email (from ${senderEmail}):`, error);
        throw new Error("Unable to send contact email -> " + (error as Error).message);
    }
}
