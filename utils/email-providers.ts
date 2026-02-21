type EmailProvider = {
    name: string;
    url: string;
};

/** Top 50 email domain → webmail mapping */
const EMAIL_PROVIDERS: Record<string, EmailProvider> = {
    // Google
    "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
    "googlemail.com": { name: "Gmail", url: "https://mail.google.com" },

    // Microsoft
    "outlook.com": { name: "Outlook", url: "https://outlook.live.com" },
    "outlook.fr": { name: "Outlook", url: "https://outlook.live.com" },
    "hotmail.com": { name: "Outlook", url: "https://outlook.live.com" },
    "hotmail.fr": { name: "Outlook", url: "https://outlook.live.com" },
    "hotmail.co.uk": { name: "Outlook", url: "https://outlook.live.com" },
    "hotmail.de": { name: "Outlook", url: "https://outlook.live.com" },
    "hotmail.it": { name: "Outlook", url: "https://outlook.live.com" },
    "hotmail.es": { name: "Outlook", url: "https://outlook.live.com" },
    "live.com": { name: "Outlook", url: "https://outlook.live.com" },
    "live.fr": { name: "Outlook", url: "https://outlook.live.com" },
    "msn.com": { name: "Outlook", url: "https://outlook.live.com" },

    // Yahoo
    "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "yahoo.fr": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "yahoo.co.uk": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "yahoo.de": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "yahoo.it": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "yahoo.es": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "ymail.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
    "rocketmail.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },

    // Apple
    "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
    "me.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
    "mac.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },

    // Proton
    "proton.me": { name: "Proton Mail", url: "https://mail.proton.me" },
    "protonmail.com": { name: "Proton Mail", url: "https://mail.proton.me" },
    "pm.me": { name: "Proton Mail", url: "https://mail.proton.me" },

    // French ISPs
    "orange.fr": { name: "Orange Mail", url: "https://mail.orange.fr" },
    "wanadoo.fr": { name: "Orange Mail", url: "https://mail.orange.fr" },
    "laposte.net": { name: "La Poste", url: "https://www.laposte.net/accueil" },
    "sfr.fr": { name: "SFR Mail", url: "https://webmail.sfr.fr" },
    "free.fr": { name: "Free Webmail", url: "https://webmail.free.fr" },
    "bbox.fr": { name: "Bouygues Mail", url: "https://www.mon-espace.bbox.bouyguestelecom.fr/bbox-mail" },

    // German
    "gmx.com": { name: "GMX", url: "https://www.gmx.com" },
    "gmx.de": { name: "GMX", url: "https://www.gmx.net" },
    "gmx.fr": { name: "GMX", url: "https://www.gmx.fr" },
    "web.de": { name: "WEB.DE", url: "https://web.de" },
    "t-online.de": { name: "T-Online", url: "https://email.t-online.de" },

    // Others
    "aol.com": { name: "AOL Mail", url: "https://mail.aol.com" },
    "zoho.com": { name: "Zoho Mail", url: "https://mail.zoho.com" },
    "mail.com": { name: "mail.com", url: "https://www.mail.com" },
    "fastmail.com": { name: "Fastmail", url: "https://www.fastmail.com" },
    "tutanota.com": { name: "Tuta Mail", url: "https://app.tuta.com" },
    "tuta.com": { name: "Tuta Mail", url: "https://app.tuta.com" },
    "mail.ru": { name: "Mail.ru", url: "https://mail.ru" },
    "yandex.com": { name: "Yandex Mail", url: "https://mail.yandex.com" },
    "yandex.ru": { name: "Yandex Mail", url: "https://mail.yandex.com" },
};

export function getEmailProvider(email: string): EmailProvider | null {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return null;
    return EMAIL_PROVIDERS[domain] ?? null;
}
