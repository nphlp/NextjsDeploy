# Common Install

## Ubuntu et SSH

- [ ] Installer Ubuntu sur le VPS depuis le panneau Hostinger
- [ ] Configurer la connexion SSH entre le VPS et la machine locale
- [ ] Se connecter en SSH au VPS

```bash
ssh root@my-vps-ip-address
```

> [!NOTE] Optionnel
> Après un réinstallation propre d'Ubuntu un message d'erreur peut apparaître (ex: "Warning: remote host identification has changed!")
>
> 1. Entrer `ssh-keygen -R my-vps-ip-address` pour supprimer l'ancienne clé.
> 2. Se reconnecter en SSH au VPS avec `ssh root@my-vps-ip-address`
> 3. Accepter la nouvelle clé en entrant "yes" puis `Entrée`

## Update & Upgrade

```bash
apt update && apt upgrade -y
```

Lors de la première installation, si une fenêtre rose "Configuring openssh-server" apparaît.
-> Sélectionner la première option : **install the package maintainer's version**.

Lors des mises à jour suivantes.
-> Sélectionner la deuxième option : **keep the local version currently installed**.

## Install Ping

```bash
sudo apt install iputils-ping
```

## Install Tree

```bash
apt install tree
tree -L 2 ../
```

## Install Make

```bash
sudo apt install make
```

## Install Lazydocker

```bash
# Installer Lazydocker
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
# Lien symbolique pour un accès global
ln -s /root/.local/bin/lazydocker /usr/local/bin/lazydocker
```

## Install Btop

```bash
apt install btop
```

## Installer Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Open Claude
claude
```
