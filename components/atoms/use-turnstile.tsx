"use client";

import { NEXT_PUBLIC_TURNSTILE_SITE_KEY } from "@lib/env-client";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { motion } from "motion/react";
import { useRef, useState } from "react";

/**
 * Cloudflare Turnstile captcha hook
 *
 * Renders a Turnstile widget that stays hidden until Cloudflare requires interaction.
 * Most users are validated silently (no visible UI). If Cloudflare detects suspicious
 * activity, the widget unfolds with a Motion animation for user interaction.
 * Once opened, the widget stays visible to avoid layout shift on submit.
 *
 * Visibility:
 * -> Hidden by default: height 0, negative margin cancels parent flex gap
 * -> onBeforeInteractive: Cloudflare needs interaction, widget unfolds (500ms ease-out)
 * -> Stays open after validation to avoid layout shift when user clicks submit
 *
 * Responsive scaling:
 * -> Cloudflare enforces 300px min-width in a closed shadow root (unreachable by CSS)
 * -> zoom: min(1, tan(atan2(100cqw, 300px))) scales the widget down fluidly
 *    tan(atan2(a, b)) = a/b as unitless number (CSS trick to divide two lengths)
 *    zoom (unlike transform: scale) affects layout, so no layout shift
 *
 * Token is single-use: always call reset() after submit (success or error)
 *
 * @returns token — Turnstile validation token (null until validated)
 * @returns captchaHeaders — fetchOptions with x-captcha-response header for Better Auth
 * @returns reset — Reset token and widget state (call after every submit)
 * @returns widget — JSX element to render in the form
 */
export function useTurnstile() {
    const ref = useRef<TurnstileInstance>(null);

    const [token, setToken] = useState<string | null>(null);
    // const [isVisible, setIsVisible] = useState(false);

    const reset = () => {
        setToken(null);
        ref.current?.reset();
    };

    const widget = (
        <motion.div
            initial={false}
            // animate={{
            //     height: isVisible ? "auto" : 0,
            //     marginTop: isVisible ? 0 : -12,
            // }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full overflow-hidden"
            style={{ containerType: "inline-size" }}
        >
            <div style={{ zoom: "min(1, tan(atan2(100cqw, 300px)))" }}>
                <Turnstile
                    ref={ref}
                    siteKey={NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setToken(token)}
                    onExpire={() => setToken(null)}
                    onError={() => setToken(null)}
                    // onBeforeInteractive={() => setIsVisible(true)}
                    options={{ theme: "auto", size: "normal" }}
                />
            </div>
        </motion.div>
    );

    /** fetchOptions with x-captcha-response header for Better Auth client calls */
    const captchaHeaders = token ? { fetchOptions: { headers: { "x-captcha-response": token } } } : {};

    return { token, captchaHeaders, reset, widget };
}
