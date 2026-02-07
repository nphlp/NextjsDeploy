import { IS_PROD, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from "@lib/env";
import nodemailer from "nodemailer";

const nodemailerTransporterSingleton = () => {
    const port = Number(SMTP_PORT);

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: port,
        secure: port === 465,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
    });
};

declare const globalThis: {
    nodemailerGlobal: ReturnType<typeof nodemailerTransporterSingleton>;
} & typeof global;

/**
 * A singleton instance of the Nodemailer transporter to prevent
 * multiple instances from being created and reuse SMTP connections.
 */
const NodemailerInstance = globalThis.nodemailerGlobal ?? nodemailerTransporterSingleton();

if (!IS_PROD) globalThis.nodemailerGlobal = NodemailerInstance;

export default NodemailerInstance;
