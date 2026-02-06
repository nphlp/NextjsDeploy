[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Common Packages**

[← Swap File](./4-swap-file.md) | [Docker Install →](./6-docker-install.md)

---

# Common Packages

Useful packages to install on the VPS.

## Ping

```bash
sudo apt install iputils-ping
```

## Tree

```bash
apt install tree
```

## Make

```bash
sudo apt install make
```

## Lazydocker

Docker TUI (terminal UI) for managing containers, images, volumes.

```bash
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
ln -s /root/.local/bin/lazydocker /usr/local/bin/lazydocker
```

## Btop

System monitor (CPU, memory, disk, network).

```bash
apt install btop
```

## Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
claude
```

---

[← Swap File](./4-swap-file.md) | [Docker Install →](./6-docker-install.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Common Packages**
