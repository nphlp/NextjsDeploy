const MAILPIT_API = "http://localhost:8025/api/v1";

interface MailpitMessage {
    ID: string;
    Subject: string;
}

interface MailpitSearchResponse {
    messages: MailpitMessage[];
}

interface MailpitMessageDetail {
    ID: string;
    Subject: string;
    Text: string;
    HTML: string;
}

/** Fetch the latest email sent to an address (with retries) */
export async function getLatestEmail(to: string, retries = 20, delay = 500): Promise<MailpitMessageDetail> {
    for (let i = 0; i < retries; i++) {
        const res = await fetch(`${MAILPIT_API}/search?query=to:${encodeURIComponent(to)}&limit=1`);
        const data: MailpitSearchResponse = await res.json();

        if (data.messages.length > 0) {
            const detail = await fetch(`${MAILPIT_API}/message/${data.messages[0].ID}`);
            return detail.json();
        }

        await new Promise((r) => setTimeout(r, delay));
    }

    throw new Error(`No email found for ${to} after ${retries} retries`);
}

/** Extract a URL matching a pattern from an email body */
export function extractLinkFromEmail(email: MailpitMessageDetail, pattern: RegExp): string {
    const body = email.HTML || email.Text;
    const match = body.match(pattern);
    if (!match) throw new Error(`No link matching ${pattern} found in email`);
    return match[0].replace(/&amp;/g, "&");
}

/** Delete all emails */
export async function deleteAllEmails(): Promise<void> {
    await fetch(`${MAILPIT_API}/messages`, { method: "DELETE" });
}
