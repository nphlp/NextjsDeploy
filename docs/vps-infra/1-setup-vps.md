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

Configure SSH connection between the VPS and your local machine from the Hostinger panel.

Connect to the VPS:

```bash
ssh root@<vps-ip-address>
```

> [!NOTE]
> After a fresh Ubuntu install, you may see: "Warning: remote host identification has changed!"
>
> 1. Remove the old key: `ssh-keygen -R <vps-ip-address>`
> 2. Reconnect: `ssh root@<vps-ip-address>`
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
