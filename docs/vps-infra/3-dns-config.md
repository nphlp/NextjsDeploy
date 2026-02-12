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

## Domain

Point the domain and all subdomains to the VPS:

| Type | Name | Content            | TTL   |
| ---- | ---- | ------------------ | ----- |
| A    | @    | `<vps-ip-address>` | 14400 |
| A    | www  | `<vps-ip-address>` | 14400 |
| A    | \*   | `<vps-ip-address>` | 14400 |

## SMTP (Email)

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

## VPN (Tailscale)

> [!WARNING]
> Configure these records **after** setting up Tailscale — see [Tailscale VPN](./9-tailscale-vpn.md).

Get the Tailscale IP of the VPS:

```bash
sudo tailscale ip -4
# e.g., 100.x.x.x
```

**Wildcards → Tailscale IP (VPN protected):**

| Type | Name             | Content          | TTL   |
| ---- | ---------------- | ---------------- | ----- |
| A    | \*.nextjs-deploy | `<tailscale-ip>` | 14400 |
| A    | \*.other-project | `<tailscale-ip>` | 14400 |

**Productions → VPS public IP (publicly accessible):**

| Type | Name          | Content            | TTL   |
| ---- | ------------- | ------------------ | ----- |
| A    | nextjs-deploy | `<vps-ip-address>` | 14400 |
| A    | other-project | `<vps-ip-address>` | 14400 |

**Admin tools → Tailscale IP (VPN protected):**

| Type | Name      | Content          | TTL   |
| ---- | --------- | ---------------- | ----- |
| A    | dokploy   | `<tailscale-ip>` | 14400 |
| A    | traefik   | `<tailscale-ip>` | 14400 |
| A    | infisical | `<tailscale-ip>` | 14400 |
| A    | umami     | `<tailscale-ip>` | 14400 |
| A    | plausible | `<tailscale-ip>` | 14400 |
| A    | signoz    | `<tailscale-ip>` | 14400 |
| A    | glitchtip | `<tailscale-ip>` | 14400 |

Specific records have priority over wildcards. Wildcards cover: `preview.*`, `experiment.*`, `prisma-studio.*`, etc.

---

[← Firewall Config](./2-firewall-config.md) | [Swap File →](./4-swap-file.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **DNS Config**
