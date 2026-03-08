[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Claude Code**

[← Dokploy Install](./7-dokploy-install.md) | [Traefik DNS Challenge →](./9-traefik-dns-challenge.md)

---

# Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) can be installed and run directly on the VPS via SSH. By adding a `CLAUDE.md` file in the home directory, Claude Code automatically loads it at the start of every session, giving it full context about the server: machine specs, installed stack, deployed projects, and common troubleshooting procedures.

## 1. Install

```bash
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 2. Create CLAUDE.md

Create the file in the `ubuntu` home directory:

```bash
nano /home/ubuntu/CLAUDE.md
```

Paste the content below (adapt to your server), then save.

## 3. Symlink for root

Create a symlink so both `ubuntu` and `root` users share the same file:

```bash
sudo ln -s /home/ubuntu/CLAUDE.md /root/CLAUDE.md
```

## 4. Verify

Launch Claude Code and ask where it is — it should respond that it's on the production VPS:

```bash
claude
```

```
> Where are you?
```

## Example CLAUDE.md

````markdown
# Production VPS - Hostinger

## Context

You are on the production VPS. The user connects via SSH as `ubuntu` and runs `claude` to execute you directly on the server. For commands requiring root privileges (docker, systemctl, apt, etc.), use `sudo` (configured with NOPASSWD).

## Machine

- **Provider**: Hostinger
- **Hostname**: `<your-hostname>`
- **OS**: Ubuntu 24.04.4 LTS (Noble Numbat)
- **CPU**: AMD EPYC 9354P 32-Core Processor
- **RAM**: 8 GB
- **IP**: `<your-vps-ip>`
- **Kernel**: 6.8.0-101-generic

## Stack

- **Dokploy** v0.28.4 (updated frequently, version may change)
- **Docker** 29.3.0
- **Docker Compose** v5.1.0
- **Traefik** v3.6.4 (reverse proxy, managed by Dokploy)

## Dokploy Projects

The `~/projects` directory is a symlink to `/etc/dokploy/compose` (created in both `/home/ubuntu` and `/root`). It contains the projects deployed via Dokploy:

- `my-app-production-xxxxxx` — My App (Next.js)
- `my-project-production-xxxxxx` — My Project (Next.js + Prisma Studio + Postgres)
- `my-project-preview-xxxxxx` — My Project (preview environment)
- `global-infisical-xxxxxx` — Infisical (secrets management, with Postgres + Redis)
- `global-umami-xxxxxx` — Umami (analytics, with Postgres)
- `global-signoz-xxxxxx` — SigNoz (observability)
- `global-plausible-xxxxxx` — Plausible (analytics)
- `global-glitchtip-xxxxxx` — GlitchTip (error tracking)

## Main Docker Services

- Dokploy (Postgres 16 + Redis 7)
- Traefik (reverse proxy)
- Infisical (backend + Postgres 14 + Redis 7.4.1)
- Umami (app + Postgres 15)
- Next.js apps (your deployed applications)

## Important Notes

- **`cloud-init` is intentionally held back** by the provider. The message in unattended-upgrades logs is normal, do not try to resolve it.
- **Dead Docker Containers**: if containers appear in "Dead" state and `docker rm -f` does not work, follow this procedure:
    1. Identify dead container directories:
        ```bash
        docker ps -a --filter "status=dead" -q
        ls /var/lib/docker/containers/ | grep <ID>
        ```
    2. Stop the Docker daemon:
        ```bash
        systemctl stop docker
        ```
    3. Delete the dead container directories in `/var/lib/docker/containers/`
    4. Restart the daemon:
        ```bash
        systemctl start docker
        ```
        Active containers will restart automatically (managed by Docker Swarm/Dokploy).
````

---

[← Dokploy Install](./7-dokploy-install.md) | [Traefik DNS Challenge →](./9-traefik-dns-challenge.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Claude Code**
