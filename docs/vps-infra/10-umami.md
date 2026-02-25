[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Umami Analytics**

[← Tailscale VPN](./9-tailscale-vpn.md)

---

# Umami Analytics

Self-hosted analytics. The dashboard stays behind VPN, tracking goes through a Next.js API route that proxies to Umami via the internal Docker network.

## Architecture

```
Browser (public)
  ├─ GET /api/umami/script.js ──► Next.js ──► http://umami:3000/script.js (via dokploy-network)
  └─ POST /api/umami/api/send ──► Next.js ──► http://umami:3000/api/send (via dokploy-network)

Dashboard (VPN only)
  └─ https://umami.your-domain.com ──► Traefik ──► umami:3000
```

## 1. DNS

Create a DNS record for the dashboard (VPN only):

| Type | Name    | Content          |
| ---- | ------- | ---------------- |
| A    | `umami` | `<tailscale-ip>` |

## 2. Dokploy Service

Create the service from the template: [Dokploy - Umami Template](https://docs.dokploy.com/docs/templates/umami)

## 3. Disable Isolated Deployment

Dokploy > Service Umami > Advanced > disable "Enable Isolated Deployment".

The `dokploy-network` is automatically added to the `umami` service.

## 4. Update the Compose

The default template has no `networks` section. Add:

**Service `umami` — add:**

```yaml
networks:
    - dokploy-network
    - umami-network
```

**Service `db` — add:**

```yaml
networks:
    - umami-network
```

**Networks section — add at the end of the file:**

```yaml
networks:
    umami-network:
        driver: bridge
    dokploy-network:
        external: true
```

Redeploy the service.

## 5. Configure Domain

Dokploy > Service Umami > Domains > set domain to `umami.your-domain.com`.

## 6. Configure Admin Account

1. Access `https://umami.your-domain.com` (VPN required)
2. Login with `admin` / `umami`
3. Change the admin password

## 7. Create a Website

1. Settings > Websites > Add website
2. Get the Website ID (Edit > Website ID)

## 8. Environment Variables

Server-side variables (not `NEXT_PUBLIC`) in `env/env.config.mjs` — see [Environment Variables](../nextjs-deploy/2-environment-variables.md):

- **`UMAMI_URL`** — Umami internal Docker URL (`http://umami:3000`)
- **`UMAMI_WEBSITE_ID`** — Website tracking ID

Production only. Excluded from other environments.

## 9. API Proxy Route

Create a catch-all route that proxies to Umami via the internal Docker network:

`app/api/umami/[...segments]/route.ts`

The browser never communicates directly with Umami. Everything goes through Next.js as an internal proxy.

## 10. Tracking Script

In `app/layout.tsx`, add the script tag pointing to the API route.

The layout is a Server Component: it accesses server variables directly.

Umami sends events to the script origin (`/api/send`). The catch-all route `/api/umami/[...segments]` doesn't capture this path.

To route events through the proxy, add `data-host-url`. Events will be sent to `/api/umami/api/send` and proxied to Umami.

---

[← Tailscale VPN](./9-tailscale-vpn.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Umami Analytics**
