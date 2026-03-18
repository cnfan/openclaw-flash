# Docker 安装（共享步骤）

本页提供统一的 Docker 安装流程，供以下文档复用：

- [Linux 安装方法 1：Docker 安装](/installation/refrences/linux-docker.html)
- [macOS 安装方法 1：Docker 安装](/installation/refrences/macos-docker.html)

## Linux（Ubuntu / Debian）安装 Docker Engine

适用：Ubuntu 20.04+、Debian 11+（含多数衍生版）。

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
source /etc/os-release
if [ "$ID" = "debian" ]; then
  curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
else
  curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
fi
sudo chmod a+r /etc/apt/keyrings/docker.gpg

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

验证：

```bash
docker --version
docker compose version
sudo docker run --rm hello-world
```

## macOS 安装 Docker Desktop

### 方式 A：安装包

1. 下载并打开 Docker Desktop for Mac 安装包（按芯片选 Apple Silicon / Intel）。
2. 把 Docker 拖到 Applications。
3. 首次启动 Docker Desktop，完成权限授权与初始化。

### 方式 B：Homebrew

```bash
brew install --cask docker
open -a Docker
```

验证：

```bash
docker --version
docker compose version
docker run --rm hello-world
```

## 可选：统一配置镜像加速

### Linux

```bash
echo '{"registry-mirrors":["https://docker.m.daocloud.io"]}' | sudo tee /etc/docker/daemon.json > /dev/null
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### macOS（Docker Desktop）

在 Docker Desktop 的 Docker Engine 配置中加入：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io"
  ]
}
```
