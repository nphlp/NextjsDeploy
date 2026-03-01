import dotenv from "dotenv";
import { deleteAllEmails } from "./helpers/mailpit";

dotenv.config({ quiet: true });

async function globalSetup() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    // Warmup: preload the server before workers start
    if (baseURL) {
        await fetch(baseURL).catch(() => {});
    }

    // Clear all emails once before the entire test suite
    await deleteAllEmails();
}

export default globalSetup;
