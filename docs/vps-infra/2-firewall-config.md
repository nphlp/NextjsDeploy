[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Firewall Config**

[← Setup VPS](./1-setup-vps.md) | [DNS Config →](./3-dns-config.md)

---

# Firewall Config

Configure the VPS firewall from the Hostinger panel.

| Action | Protocol | Port | Source | Detail |
| ------ | -------- | ---- | ------ | ------ |
| accept | SSH      | 22   | any    | any    |
| accept | HTTP     | 80   | any    | any    |
| accept | HTTPS    | 443  | any    | any    |
| drop   | any      | any  | any    | any    |

- **SSH** — required for remote VPS administration
- **HTTP** — required for Let's Encrypt SSL certificate validation
- **HTTPS** — required for web services (Dokploy, apps, etc.)
- **Drop all** — block all other connections for security

> [!WARNING]
> Enable the firewall **after** Dokploy is installed and the domain is configured — see [Dokploy Install](./7-dokploy-install.md).

---

[← Setup VPS](./1-setup-vps.md) | [DNS Config →](./3-dns-config.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Firewall Config**
