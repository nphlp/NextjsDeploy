"use server";

import { IS_DEV, SMTP_FROM, SMTP_FROM_NAME } from "@lib/env";
import NodemailerInstance from "@lib/nodemailer";
import { render } from "@react-email/render";
import { JSX } from "react";

type SendEmailActionProps = {
    subject: string;
    email: string;
    body: JSX.Element;
};

export default async function SendEmailAction(props: SendEmailActionProps) {
    const { subject, email, body } = props;

    try {
        const html = await render(body, {
            pretty: true,
        });

        if (IS_DEV) {
            console.log("📨 Sending email...");
        }

        const success = await NodemailerInstance.sendMail({
            from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
            to: email,
            subject: subject,
            html,
        });

        if (IS_DEV) {
            console.log(`✅ Email sent successfully to ${email}`);
        }

        return success;
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error);
        throw new Error("Unable to send email -> " + (error as Error).message);
    }
}
