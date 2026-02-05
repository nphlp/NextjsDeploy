/**
 * Umami analytics proxy route.
 *
 * Proxies requests to the internal Umami Docker service (dokploy-network),
 * keeping the Umami dashboard behind the VPN while allowing tracking from the public site.
 *
 * - GET /api/umami/script.js → http://umami:3000/script.js
 * - POST /api/umami/api/send → http://umami:3000/api/send
 *
 * Requires `data-host-url="/api/umami"` on the script tag in layout.tsx
 * so the Umami script sends events through this proxy instead of `/api/send`.
 */
import { isUmamiDefined, umamiUrl } from "@lib/env";
import { notFound } from "next/navigation";

type UmamiProps = {
    params: Promise<{ segments: string[] }>;
};

async function handler(request: Request, props: UmamiProps) {
    if (!isUmamiDefined) return notFound();

    const { segments } = await props.params;

    const url = `${umamiUrl}/${segments.join("/")}`;

    const method = request.method;
    const headers = request.headers;
    const body = method !== "GET" ? await request.text() : undefined;

    // Redirect the request to Umami serving as a proxy
    const response = await fetch(url, { method, headers, body });

    return new Response(response.body, {
        status: response.status,
        headers: { "Content-Type": response.headers.get("Content-Type") || "text/plain" },
    });
}

export { handler as GET, handler as POST };
