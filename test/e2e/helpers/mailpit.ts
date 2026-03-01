const MAILPIT_API = "http://localhost:8025/api/v1";

interface MailpitMessage {
    ID: string;
    Subject: string;
    From: { Address: string };
    To: { Address: string }[];
    Snippet: string;
}

interface MailpitSearchResponse {
    messages: MailpitMessage[];
    total: number;
}

interface MailpitMessageDetail {
    ID: string;
    Subject: string;
    Text: string;
    HTML: string;
}

/** Fetch the latest email sent to an address (with retries for async delivery) */
export async function getLatestEmail(to: string, retries = 10, delay = 500): Promise<MailpitMessageDetail> {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(`${MAILPIT_API}/search?query=to:${encodeURIComponent(to)}&limit=1`);
        const data: MailpitSearchResponse = await res.json();

        if (data.messages.length > 0) {
            const id = data.messages[0].ID;
            const detail = await fetch(`${MAILPIT_API}/message/${id}`);
            return detail.json();
        }

        await new Promise((r) => setTimeout(r, delay));
    }

    throw new Error(`No email found for ${to} after ${retries} retries`);
}

/** Extract a URL matching a pattern from an email body */
export async function extractLink(to: string, pattern: RegExp): Promise<string> {
    const email = await getLatestEmail(to);
    const body = email.HTML || email.Text;
    const match = body.match(pattern);

    if (!match) {
        throw new Error(`No link matching ${pattern} found in email to ${to}`);
    }

    // Decode HTML entities (e.g. &amp; → &)
    return match[0].replace(/&amp;/g, "&");
}

/** Delete all emails (cleanup) */
export async function deleteAllEmails(): Promise<void> {
    await fetch(`${MAILPIT_API}/messages`, { method: "DELETE" });
}
