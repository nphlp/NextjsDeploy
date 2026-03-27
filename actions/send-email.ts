"use server";

import { SMTP_FROM, SMTP_FROM_NAME } from "@lib/env";
import NodemailerInstance from "@lib/nodemailer";
import { render } from "@react-email/render";
import { JSX } from "react";

type SendEmailActionProps = {
    subject: string;
    email: string;
    body: JSX.Element;
};

/**
 * Low-level email sender (Nodemailer + React Email)
 * -> Used server-side only (auth callbacks, other server actions)
 * -> Not called directly from client components
 */
export default async function SendEmailAction(props: SendEmailActionProps) {
    const { subject, email, body } = props;

    try {
        const html = await render(body, { pretty: true });

        const success = await NodemailerInstance.sendMail({
            from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
            to: email,
            subject,
            html,
        });

        return success;
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        throw new Error("Unable to send email -> " + (error as Error).message);
    }
}
