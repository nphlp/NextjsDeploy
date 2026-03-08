[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Setup VPS**

[Firewall Config →](./2-firewall-config.md)

---

# Setup VPS

## Prerequisites

- A VPS (e.g., Hostinger VPS)
- A domain name (e.g., `your-domain.com`)
- An email address based on this domain (e.g., `hello@your-domain.com`)

## Install Ubuntu

Install Ubuntu on the VPS from the Hostinger panel (auto-install).

## Configure SSH

### Generate a key

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_vps
```

Add the public key (`~/.ssh/id_ed25519_vps.pub`) to the VPS via the hPanel interface.

### Local SSH config

Add both hosts to `~/.ssh/config`:

```
# VPS Hostinger (root)
Host vps-root
  HostName <your-vps-ip>
  User root
  IdentityFile ~/.ssh/id_ed25519_vps
  IdentitiesOnly yes

# VPS Hostinger (user)
Host vps-ubuntu
  HostName <your-vps-ip>
  User ubuntu
  IdentityFile ~/.ssh/id_ed25519_vps
  IdentitiesOnly yes
```

### Connect

```bash
ssh vps-ubuntu   # day-to-day (ubuntu)
ssh vps-root     # admin tasks (root)
```

> [!NOTE]
> After a fresh Ubuntu install, you may see: "Warning: remote host identification has changed!"
>
> 1. Remove the old key: `ssh-keygen -R <your-vps-ip>`
> 2. Reconnect: `ssh vps-ubuntu`
> 3. Accept the new key by typing `yes`

## Update & Upgrade

```bash
apt update && apt upgrade -y
```

On first install, if a pink "Configuring openssh-server" window appears:
→ Select **install the package maintainer's version**

On subsequent updates:
→ Select **keep the local version currently installed**

---

[Firewall Config →](./2-firewall-config.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Setup VPS**
