import * as OTPAuth from "otpauth";

export async function generateTOTP(secret: string): Promise<string> {
    // If within last 5s of the 30s TOTP window, wait for next window to avoid code expiry during input
    const secondsInWindow = Math.floor(Date.now() / 1000) % 30;
    if (secondsInWindow > 25) {
        await new Promise((resolve) => setTimeout(resolve, (30 - secondsInWindow + 1) * 1000));
    }

    const totp = new OTPAuth.TOTP({ algorithm: "SHA1", digits: 6, period: 30, secret });
    return totp.generate();
}
