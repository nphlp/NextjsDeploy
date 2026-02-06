# 1. Création du fichier swap (4GB)

```bash
fallocate -l 4G /swapfile
```

# 2. Sécurisation des permissions (lecture/écriture root uniquement)

```bash
chmod 600 /swapfile
```

# 3. Formatage en espace swap

```bash
mkswap /swapfile
```

# 4. Activation du swap

```bash
swapon /swapfile
```

# 5. Persistance au reboot (ajout dans fstab)

```bash
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

# 6. Vérification

```bash
swapon --show
free -h
```
