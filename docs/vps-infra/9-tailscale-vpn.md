[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Tailscale VPN**

[← Traefik DNS Challenge](./8-traefik-dns-challenge.md) | [Umami Analytics →](./10-umami.md)

---

# Tailscale VPN

Protect sensitive environments via Tailscale VPN. Only devices connected to the Tailscale network can access protected routes.

Protected routes:

- `dokploy.your-domain.com` — Dokploy panel
- `traefik.your-domain.com` — Traefik dashboard
- `preview.*.your-domain.com` — Preview environments
- `experiment.*.your-domain.com` — Experiment environments
- `prisma-studio.*.your-domain.com` — Prisma Studio (database access)
- `umami.your-domain.com` — Umami analytics
- and more...

## 1. Install Tailscale on the VPS

Tailscale is natively integrated into Dokploy.

Follow the official guide: [Dokploy - Tailscale Integration](https://docs.dokploy.com/docs/core/guides/tailscale)

## 2. Configure DNS

Add DNS records for VPN-protected domains — see [DNS Config — VPN](./3-dns-config.md#vpn-tailscale).

## 3. Switch to DNS Challenge

VPN-protected domains are not publicly accessible, so Let's Encrypt cannot validate certificates via HTTP. Make sure you switched to DNS Challenge — see [Traefik DNS Challenge](./8-traefik-dns-challenge.md).

## Usage

1. Connect Tailscale on your device
2. Access protected URLs normally in your browser

## Security

| Layer       | Protection                          |
| ----------- | ----------------------------------- |
| Network     | VPN Tailscale (WireGuard)           |
| Application | Basic Auth Traefik (Prisma Studio)  |
| Transport   | HTTPS (Let's Encrypt DNS Challenge) |

---

[← Traefik DNS Challenge](./8-traefik-dns-challenge.md) | [Umami Analytics →](./10-umami.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Tailscale VPN**
