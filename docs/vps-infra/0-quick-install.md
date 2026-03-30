[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Quick Install**

[Setup VPS →](./1-setup-vps.md)

---

# Quick Install

Condensed checklist for setting up a VPS from scratch. Each step links to the detailed guide. For deploying the app on an existing infra, see [Quick Deploy](../nextjs-deploy/0-quick-deploy.md).

## Prerequisites

- A VPS (e.g., Hostinger)
- A domain name (e.g., `your-domain.com`)
- An email address on this domain (e.g., `hello@your-domain.com`)

---

## 1. VPS & SSH — [detailed guide](./1-setup-vps.md)

```bash
# Local machine
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_vps
```

- Add public key to Hostinger hPanel
- Configure `~/.ssh/config` with `vps-root` and `vps-ubuntu` hosts

```bash
# On VPS (as root)
apt update && apt upgrade -y
```

## 2. Swap File — [detailed guide](./4-swap-file.md)

```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 3. Common Packages — [detailed guide](./5-common-packages.md)

```bash
sudo apt install iputils-ping tree make btop
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
ln -s /root/.local/bin/lazydocker /usr/local/bin/lazydocker
```

## 4. Docker — [detailed guide](./6-docker-install.md)

```bash
sudo apt-get update && sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
sudo systemctl enable docker
sudo docker run hello-world  # verify
docker system prune -a --volumes -f  # clean up test container
```

## 5. Dokploy — [detailed guide](./7-dokploy-install.md)

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

- Access at `http://<vps-ip>:3000`
- Settings > Web Server > Server Domain:
    - Domain: `dokploy.your-domain.com`
    - Email: `hello@your-domain.com`
    - HTTPS: enable, Provider: Let's Encrypt
- Create project symlinks:

```bash
ln -s /etc/dokploy/compose ~/projects
sudo ln -s /etc/dokploy/compose /root/projects
```

- Settings > Web Server > enable "Daily Docker Cleanup"

## 6. DNS — [detailed guide](./3-dns-config.md)

Domain records (Hostinger DNS Zone):

| Type | Name  | Value  |
| ---- | ----- | ------ |
| A    | `@`   | VPS IP |
| A    | `www` | VPS IP |
| A    | `*`   | VPS IP |

SMTP: Create email via Hostinger > Emails, auto-generate DNS records.

## 7. Firewall — [detailed guide](./2-firewall-config.md)

> [!WARNING]
> Enable **AFTER** Dokploy is installed and domain is configured.

Configure from Hostinger panel:

| Port        | Action |
| ----------- | ------ |
| 22 (SSH)    | Accept |
| 80 (HTTP)   | Accept |
| 443 (HTTPS) | Accept |
| All others  | Drop   |

Reboot VPS after enabling.

## 8. Traefik DNS Challenge — [detailed guide](./9-traefik-dns-challenge.md)

- Get Hostinger API token from [hPanel > API](https://hpanel.hostinger.com/profile/api)
- Dokploy > Web Server > Traefik > Environment:

```env
HOSTINGER_API_TOKEN=your_token
```

- Dokploy > Traefik File System > `traefik.yml`: replace `httpChallenge` with:

```yml
dnsChallenge:
    provider: hostinger
    resolvers:
        - "1.1.1.1:53"
        - "8.8.8.8:53"
```

- Reload Traefik

## 9. Tailscale VPN — [detailed guide](./10-tailscale-vpn.md)

- Follow [Dokploy Tailscale Integration](https://docs.dokploy.com/docs/core/guides/tailscale)
- Get Tailscale IP: `sudo tailscale ip -4`
- Update DNS: point admin subdomains (dokploy, traefik, prisma-studio, etc.) to Tailscale IP

## 10. Claude Code (optional) — [detailed guide](./8-claude-code.md)

```bash
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 11. Umami Analytics (optional) — [detailed guide](./11-umami.md)

- DNS: `umami` A record > Tailscale IP
- Dokploy: Create from Umami template
- Update compose networks (`dokploy-network` + `umami-network`)
- Set domain: `umami.your-domain.com`
- Default login: `admin` / `umami`

## 12. Cloudflare R2 Backups (optional) — [detailed guide](./12-cloudflare-r2.md)

- Cloudflare > R2 > Create bucket `dokploy-backups`
- Create API token (Object Read & Write, scoped to bucket)
- Dokploy > Settings > S3 Destinations > Add with R2 credentials
- Configure backup schedules on database services (Backups tab)

---

## Order Summary

```
VPS & SSH → Swap → Packages → Docker → Dokploy → DNS → Firewall → Traefik → Tailscale
                                                                         ↓
                                                              Claude Code (optional)
                                                              Umami (optional)
                                                              R2 Backups (optional)
```

---

[Setup VPS →](./1-setup-vps.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Quick Install**
