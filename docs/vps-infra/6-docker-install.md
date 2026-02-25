[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Docker Install**

[← Common Packages](./5-common-packages.md) | [Dokploy Install →](./7-dokploy-install.md)

---

# Docker Install

Install Docker Engine following: [Docker Ubuntu Installation](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

**1. Add Docker's official GPG key**

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

**2. Add the repository to Apt sources**

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

**3. Install Docker Engine, containerd and Docker Compose**

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

**4. Test the installation**

```bash
sudo docker run hello-world
```

**5. Clean up**

```bash
docker stop $(docker ps -a -q)
docker rmi $(docker images -q)
docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls -q)
docker system prune -a --volumes -f
```

**6. Enable Docker on boot**

```bash
sudo systemctl enable docker
```

---

[← Common Packages](./5-common-packages.md) | [Dokploy Install →](./7-dokploy-install.md)

[README](../../README.md) > [VPS Infra](./1-setup-vps.md) > **Docker Install**
