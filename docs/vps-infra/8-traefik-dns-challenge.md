[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Traefik DNS Challenge**

[← Dokploy Install](./7-dokploy-install.md) | [Tailscale VPN →](./9-tailscale-vpn.md)

---

# Traefik DNS Challenge

Switch Let's Encrypt from HTTP Challenge to DNS Challenge (Hostinger). Required for VPN-protected domains that are not publicly accessible.

## 1. Generate a Hostinger API Token

[Hostinger hPanel → API](https://hpanel.hostinger.com/profile/api)

## 2. Add the Token to Traefik

Dokploy → Web Server → Traefik → Modify Environment:

```env
HOSTINGER_API_TOKEN=your_hostinger_api_token
```

## 3. Update Traefik Config

Dokploy → Traefik File System → `traefik.yml`

Replace `httpChallenge`:

```yml
certificatesResolvers:
    letsencrypt:
        acme:
            email: hello@your-domain.com
            storage: /etc/dokploy/traefik/dynamic/acme.json
            httpChallenge:
                entryPoint: web
```

With `dnsChallenge`:

```yml
certificatesResolvers:
    letsencrypt:
        acme:
            email: hello@your-domain.com
            storage: /etc/dokploy/traefik/dynamic/acme.json
            dnsChallenge:
                provider: hostinger
                resolvers:
                    - "1.1.1.1:53"
                    - "8.8.8.8:53"
```

## 4. Reload Traefik

Dokploy → Web Server → Traefik → Reload

## 5. Enable Traefik Dashboard

> [!WARNING]
> Add the DNS record for `traefik` pointing to the Tailscale IP **before** enabling the dashboard, otherwise it will be publicly exposed — see [DNS Config](./3-dns-config.md).

**Update `traefik.yml`** — replace:

```yml
api:
    insecure: true
```

With:

```yml
api:
    dashboard: true
```

**Create the dynamic router on the VPS:**

```bash
touch /etc/dokploy/traefik/dynamic/dashboard.yml
```

**Add the config** from Dokploy (File System → Traefik → dynamic → `dashboard.yml`):

```yml
http:
    routers:
        dashboard:
            rule: Host(`traefik.your-domain.com`)
            entryPoints:
                - websecure
            service: api@internal
            tls:
                certResolver: letsencrypt
```

**Remove port mapping 8080:**

Dokploy → Web Server → Traefik → Additional Port Mappings → delete

**Reload Traefik:**

Dokploy → Web Server → Traefik → Reload

The dashboard is read-only. VPN access is sufficient protection.

---

[← Dokploy Install](./7-dokploy-install.md) | [Tailscale VPN →](./9-tailscale-vpn.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Traefik DNS Challenge**
