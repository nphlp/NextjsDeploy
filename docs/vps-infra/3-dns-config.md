[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **DNS Config**

[← Firewall Config](./2-firewall-config.md) | [Swap File →](./4-swap-file.md)

---

# DNS Config

All DNS configurations in one place. Configured from the Hostinger DNS panel.

## Name Servers

Leave the default configuration:

| Type | Name            | Content             | TTL   |
| ---- | --------------- | ------------------- | ----- |
| NS   | your-domain.com | ns1.dns-parking.com | 86400 |
| NS   | your-domain.com | ns2.dns-parking.com | 86400 |

## Security-First DNS Pattern

The principle: **everything behind VPN by default**, explicitly expose only what needs to be public.

- `*` (wildcard) → Tailscale IP (VPN) — all subdomains are private by default
- `@` (root) → VPS public IP — production is publicly accessible
- Specific records for public services override the wildcard

This prevents accidental exposure of admin tools, preview environments, or internal services. Any new subdomain automatically lands behind VPN.

## Main Domain (your-domain.com)

### A Records

| Type | Name             | Content            | Access  | Purpose                            |
| ---- | ---------------- | ------------------ | ------- | ---------------------------------- |
| A    | @                | `<vps-ip-address>` | Public  | Root domain (your-domain.com)      |
| A    | \*               | `<tailscale-ip>`   | **VPN** | Default: all subdomains behind VPN |
| A    | nextjs-deploy    | `<vps-ip-address>` | Public  | Production app (explicit override) |
| A    | \*.nextjs-deploy | `<tailscale-ip>`   | VPN     | Preview/experiment/prisma-studio   |

Specific records have priority over wildcards. So `nextjs-deploy.your-domain.com` is public while `anything-else.your-domain.com` falls behind VPN.

**What the wildcard covers automatically** (no individual records needed):

- `dokploy.your-domain.com` → VPN
- `traefik.your-domain.com` → VPN
- `umami.your-domain.com` → VPN
- Any other admin tool → VPN

### SMTP (Email)

1. Create an email address `hello@your-domain.com` from the Hostinger email panel
2. Launch the automatic DNS configuration from Hostinger

This generates the following records automatically:

| Type  | Name                        | Content                                        | TTL   |
| ----- | --------------------------- | ---------------------------------------------- | ----- |
| CNAME | hostingermail-c.\_domainkey | hostingermail-c.dkim.mail.hostinger.com        | 300   |
| CNAME | hostingermail-b.\_domainkey | hostingermail-b.dkim.mail.hostinger.com        | 300   |
| CNAME | hostingermail-a.\_domainkey | hostingermail-a.dkim.mail.hostinger.com        | 300   |
| CNAME | autodiscover                | autodiscover.mail.hostinger.com                | 300   |
| CNAME | autoconfig                  | autoconfig.mail.hostinger.com                  | 300   |
| TXT   | \_dmarc                     | "v=DMARC1; p=none"                             | 3600  |
| TXT   | @                           | "v=spf1 include:\_spf.mail.hostinger.com ~all" | 3600  |
| MX    | @                           | mx1.hostinger.com (priority 5)                 | 14400 |
| MX    | @                           | mx2.hostinger.com (priority 10)                | 14400 |

## Dedicated Domains (e.g. my-project.com)

For projects with their own domain, the same security-first pattern applies:

| Type | Name | Content            | Access  | Purpose                     |
| ---- | ---- | ------------------ | ------- | --------------------------- |
| A    | @    | `<vps-ip-address>` | Public  | Production (my-project.com) |
| A    | \*   | `<tailscale-ip>`   | **VPN** | Everything else behind VPN  |

This automatically protects:

- `experiment.my-project.com` → VPN
- `preview.my-project.com` → VPN
- `prisma-studio.my-project.com` → VPN
- `prisma-experiment.my-project.com` → VPN
- `prisma-preview.my-project.com` → VPN
- Any unknown subdomain → VPN

> **Important**: DNS wildcards only match **one level** of subdomain. `*.my-project.com` covers `experiment.my-project.com` but NOT `prisma-studio.experiment.my-project.com` (2 levels). That's why prisma-studio domains use **flat naming** with hyphens (`prisma-experiment.my-project.com`) instead of nested dots (`prisma-studio.experiment.my-project.com`).

No `www` record needed — it's unnecessary and the wildcard catches it behind VPN anyway.

### Adding a new dedicated domain (checklist)

1. **Hostinger**: Add 2 DNS records (`@` → public IP, `*` → Tailscale IP)
2. **Traefik**: SSL certificates are auto-provisioned via Let's Encrypt DNS challenge
3. **Dokploy**: Configure the compose file with the new domain labels
4. **Env config**: Set `VPS_NEXTJS_DOMAIN` to the new domain in `env/env.config.mjs`

## Getting the IPs

**VPS public IP**: check your hosting provider dashboard.

**Tailscale VPN IP** (requires [Tailscale setup](./10-tailscale-vpn.md)):

```bash
sudo tailscale ip -4
# e.g., 100.x.x.x
```

---

[← Firewall Config](./2-firewall-config.md) | [Swap File →](./4-swap-file.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **DNS Config**
