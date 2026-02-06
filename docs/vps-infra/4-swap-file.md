[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Swap File**

[← DNS Config](./3-dns-config.md) | [Common Packages →](./5-common-packages.md)

---

# Swap File

4GB swap file to prevent build crashes on low-memory VPS.

**1. Create the swap file (4GB)**

```bash
fallocate -l 4G /swapfile
```

**2. Secure permissions (root read/write only)**

```bash
chmod 600 /swapfile
```

**3. Format as swap space**

```bash
mkswap /swapfile
```

**4. Enable swap**

```bash
swapon /swapfile
```

**5. Persist on reboot (add to fstab)**

```bash
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**6. Verify**

```bash
swapon --show
free -h
```

---

[← DNS Config](./3-dns-config.md) | [Common Packages →](./5-common-packages.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Swap File**
