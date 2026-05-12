export const getOs = (userAgent: string) => {
    if (/iPad/i.test(userAgent)) return "iPad";
    if (/iPhone/i.test(userAgent)) return "iPhone";
    if (/iPod/i.test(userAgent)) return "iPod";
    if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Android/i.test(userAgent)) return "Android";
    if (/Linux/i.test(userAgent)) return "Linux";
    return "Inconnu";
};

export const getBrowser = (userAgent: string) => {
    if (/Chrome\/\d+/i.test(userAgent) && !/Edge|Edg|OPR|Opera/i.test(userAgent)) return "Chrome";
    else if (/Safari\/\d+/i.test(userAgent) && !/Chrome/i.test(userAgent)) return "Safari";
    else if (/Firefox\/\d+/i.test(userAgent)) return "Firefox";
    else if (/Edg\/\d+/i.test(userAgent)) return "Edge";
    else if (/OPR\/\d+/i.test(userAgent) || /Opera/i.test(userAgent)) return "Opera";
    else return "Inconnu";
};
