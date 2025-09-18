import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontSize: {
                "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
                "3xs": ["0.5rem", { lineHeight: "0.625rem" }],
            },
        },
    },
    plugins: [],
} satisfies Config;
