import { APIError, createAuthMiddleware } from "better-auth/api";
import { resolveMx } from "node:dns/promises";
import z from "zod";

/**
 * Top 50 most common trusted email domains
 * -> If domain is in this list, skip external API checks
 */
const TRUSTED_DOMAINS = new Set([
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "outlook.fr",
    "hotmail.com",
    "hotmail.fr",
    "hotmail.co.uk",
    "hotmail.it",
    "hotmail.es",
    "live.com",
    "live.fr",
    "live.co.uk",
    "msn.com",
    "yahoo.com",
    "yahoo.fr",
    "yahoo.co.uk",
    "yahoo.com.br",
    "yahoo.co.in",
    "yahoo.it",
    "yahoo.de",
    "yahoo.es",
    "ymail.com",
    "rocketmail.com",
    "icloud.com",
    "me.com",
    "mac.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "mail.com",
    "gmx.com",
    "gmx.de",
    "gmx.fr",
    "yandex.ru",
    "mail.ru",
    "rediffmail.com",
    "free.fr",
    "orange.fr",
    "sfr.fr",
    "laposte.net",
    "wanadoo.fr",
    "neuf.fr",
    "web.de",
    "t-online.de",
    "libero.it",
    "uol.com.br",
    "comcast.net",
    "att.net",
    "verizon.net",
    "cox.net",
    "sbcglobal.net",
    "bellsouth.net",
    "bigpond.com",
]);

/**
 * Top 50 most common disposable email domains
 */
const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com",
    "guerrillamail.com",
    "guerrillamail.net",
    "guerrillamail.org",
    "guerrillamail.de",
    "guerrillamail.biz",
    "guerrillamailblock.com",
    "grr.la",
    "sharklasers.com",
    "tempmail.com",
    "temp-mail.org",
    "tempmail.net",
    "throwaway.email",
    "throwawaymail.com",
    "fakeinbox.com",
    "yopmail.com",
    "yopmail.fr",
    "yopmail.net",
    "trashmail.com",
    "trashmail.net",
    "trashmail.me",
    "trash-mail.com",
    "trashymail.com",
    "10minutemail.com",
    "10minute.email",
    "minutemail.com",
    "maildrop.cc",
    "mailnesia.com",
    "dispostable.com",
    "disposable-mail.com",
    "mailcatch.com",
    "tempail.com",
    "tempr.email",
    "discard.email",
    "discardmail.com",
    "emailondeck.com",
    "getnada.com",
    "mohmal.com",
    "burnermail.io",
    "mailsac.com",
    "mail7.io",
    "gmailnator.com",
    "spamgourmet.com",
    "mytemp.email",
    "jetable.org",
    "getairmail.com",
    "meltmail.com",
    "mailnull.com",
]);

/**
 * Check disposable email via Disify API (free, no key)
 * @see https://disify.com
 */
async function checkDisify(email: string): Promise<boolean> {
    const reponse = await fetch(`https://disify.com/api/email/${email}`);
    const data: { disposable: boolean } = await reponse.json();
    return data.disposable;
}

/**
 * Check disposable email via MailCheck.ai API (free, no key)
 * @see https://www.mailcheck.ai
 */
async function checkMailcheck(email: string): Promise<boolean> {
    const reponse = await fetch(`https://api.mailcheck.ai/email/${email}`);
    const data: { disposable: boolean } = await reponse.json();
    return data.disposable;
}

/**
 * Check if domain has valid MX records (can receive emails)
 */
async function hasMxRecords(domain: string): Promise<boolean> {
    try {
        const records = await resolveMx(domain);
        return records.length > 0;
    } catch {
        return false;
    }
}

/**
 * Validate email domain
 * 1. Reject disposable domains (local list, instant)
 * 2. Accept trusted domains (local list, instant, skip external checks)
 * 3. Check via Disify API (fallback: MailCheck.ai)
 * 4. Check DNS MX records
 */
async function isEmailDomainValid(email: string): Promise<boolean> {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;

    // 1. Reject disposable domains
    if (DISPOSABLE_DOMAINS.has(domain)) return false;

    // 2. Accept trusted domains (no external request needed)
    if (TRUSTED_DOMAINS.has(domain)) return true;

    // 3. External API check (Disify → MailCheck.ai fallback)
    try {
        const isDisposable = await checkDisify(email);
        if (isDisposable) return false;
    } catch {
        try {
            const isDisposable = await checkMailcheck(email);
            if (isDisposable) return false;
        } catch {
            // Both APIs failed, continue with DNS check
        }
    }

    // 4. DNS MX records check
    const hasMx = await hasMxRecords(domain);
    if (!hasMx) return false;

    return true;
}

type PasswordFailures = "uppercase" | "lowercase" | "number" | "specialChar" | "notLongEnough" | "tooLong";

type IsPasswordStrongEnoughResponse =
    | {
          isValid: true;
          failures?: undefined;
      }
    | {
          isValid: false;
          failures: PasswordFailures[];
      };

/**
 * Server-side password strength validation
 * -> at least 1 uppercase, 1 lowercase, 1 number and 1 special character
 * -> minimum 12 characters, maximum 128 characters (enforced by better-auth config)
 */
function isPasswordStrongEnough(password: string): IsPasswordStrongEnoughResponse {
    const hasUppercase = z.string().regex(/[A-Z]/).safeParse(password).success;
    const hasLowercase = z.string().regex(/[a-z]/).safeParse(password).success;
    const hasNumber = z.string().regex(/[0-9]/).safeParse(password).success;
    const hasSpecialChar = z
        .string()
        .regex(/[^a-zA-Z0-9]/)
        .safeParse(password).success;
    const isLongEnough = z.string().min(12).safeParse(password).success;
    const isNotTooLong = z.string().max(128).safeParse(password).success;

    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isLongEnough && isNotTooLong;

    if (!isValid) {
        const failures: PasswordFailures[] = [];
        if (!hasUppercase) failures.push("uppercase");
        if (!hasLowercase) failures.push("lowercase");
        if (!hasNumber) failures.push("number");
        if (!hasSpecialChar) failures.push("specialChar");
        if (!isLongEnough) failures.push("notLongEnough");
        if (!isNotTooLong) failures.push("tooLong");
        return { isValid, failures };
    }

    return { isValid };
}

type AuthMiddlewareContext = Parameters<typeof createAuthMiddleware>[0];

/**
 * Auth before middleware
 * -> Validate email domain on sign-up and change-email (disposable + MX)
 * -> Validate password strength on sign-up, reset-password and change-password
 */
export const authBeforeMiddleware: AuthMiddlewareContext = async (ctx) => {
    // Validate email domain on sign-up and change-email
    if (ctx.path === "/sign-up/email" || ctx.path === "/change-email") {
        const email = ctx.body?.email;

        if (email) {
            const isValid = await isEmailDomainValid(email);
            if (!isValid) throw new APIError("BAD_REQUEST", { message: "This email domain is not allowed." });
        }
    }

    // Validate password strength on sign-up, reset-password and change-password
    if (ctx.path === "/sign-up/email" || ctx.path === "/reset-password" || ctx.path === "/change-password") {
        const password = ctx.body?.password;
        if (!password) throw new APIError("BAD_REQUEST", { message: "Missing password." });

        const passwordStrength = isPasswordStrongEnough(password);

        if (!passwordStrength.isValid) {
            const message = `Password failed the following strength requirements: ${passwordStrength.failures.join(", ")}.`;
            throw new APIError("BAD_REQUEST", { message });
        }
    }
};
