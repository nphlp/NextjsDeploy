import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

/**
 * MSW handlers for external API mocking
 * -> Disify: email disposability check
 * -> MailCheck: fallback email disposability check
 * -> HIBP: Have I Been Pwned password check (k-anonymity, SHA-1 prefix)
 */

/** Default: all emails are NOT disposable, no passwords compromised */
export const defaultHandlers = [
    // Disify — default: not disposable
    http.get("https://disify.com/api/email/*", () => {
        return HttpResponse.json({ disposable: false });
    }),
    // MailCheck — default: not disposable
    http.get("https://api.mailcheck.ai/email/*", () => {
        return HttpResponse.json({ disposable: false });
    }),
    // HIBP — default: no matches (password not compromised)
    http.get("https://api.pwnedpasswords.com/range/*", () => {
        return HttpResponse.text("0000000000000000000000000000000:0");
    }),
];

export const server = setupServer(...defaultHandlers);

// --- Scenario handlers (use in individual tests) ---

/** Disify returns disposable: true */
export const disifyDisposable = http.get("https://disify.com/api/email/*", () => {
    return HttpResponse.json({ disposable: true });
});

/** Disify is down (500 error) */
export const disifyDown = http.get("https://disify.com/api/email/*", () => {
    return HttpResponse.error();
});

/** MailCheck returns disposable: true */
export const mailcheckDisposable = http.get("https://api.mailcheck.ai/email/*", () => {
    return HttpResponse.json({ disposable: true });
});

/** MailCheck is down (500 error) */
export const mailcheckDown = http.get("https://api.mailcheck.ai/email/*", () => {
    return HttpResponse.error();
});

/** HIBP returns a match for the password (compromised) */
export const hibpCompromised = (sha1Suffix: string) =>
    http.get("https://api.pwnedpasswords.com/range/*", () => {
        // Return the suffix with a count > 0 to indicate compromise
        return HttpResponse.text(`${sha1Suffix}:42`);
    });
