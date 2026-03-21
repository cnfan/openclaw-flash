# Linux 安装方法 1：Docker 安装（推荐）

这是官方推荐的 Linux 安装方式。通过 **Docker** 容器技术，你可以获得最佳的隔离性和安全性，避免与系统其他软件冲突。

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| Docker | ⭐⭐⭐⭐⭐ 推荐 | 优秀 | 低 | **大多数用户的首选** |
| [直接安装 (APT)](./linux-native-apt.md) | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用服务器 |
| [直接安装 (YUM)](./linux-native-yum.md) | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用服务器 |

## 为什么推荐 Docker 安装？

- **环境隔离**：OpenClaw 运行在独立容器中，不影响主机系统
- **易于管理**：一键启动、停止、升级
- **可重复性**：在任何 Linux 发行版上获得一致的运行环境
- **安全性**：容器隔离降低潜在风险
- **易于卸载**：删除容器即可完全清理

## 前置条件

- 任意现代 Linux 发行版（推荐 Debian 11+ 或 Ubuntu 20.04+）
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间
- root 权限或 sudo 权限

遇到任何安装失败，请直接看文末的 [失败指引](#failure-guide)。

## 步骤 1：安装 Docker

先执行共享安装步骤：

- [Docker 安装（共享步骤）](./docker-install.md)

在共享页中，选择“Linux（Ubuntu / Debian）安装 Docker Engine”章节执行完成后，再继续本页后续步骤。

## 步骤 2：启动 Docker 服务

```bash
# 启动 Docker 服务
sudo systemctl start docker

# 设置开机自启动
sudo systemctl enable docker

# 验证 Docker 状态
sudo systemctl status docker
```

## 步骤 3：配置 Docker 镜像加速

```bash
echo '{"registry-mirrors":["https://docker.m.daocloud.io"]}' | sudo tee /etc/docker/daemon.json > /dev/null
sudo systemctl daemon-reload
sudo systemctl restart docker
```

判断"没问题"可以看这几点：

- `Active: active (running)` 表示服务正在运行
- 没有 `Failed` 或 `Error` 相关的错误信息

示例输出：

```text
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2024-01-01 10:00:00 UTC; 10s ago
```

## 步骤 4：配置非 root 用户（可选但推荐）

默认情况下，Docker 需要 root 权限。为了安全起见，可以将当前用户添加到 docker 组：

```bash
# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录或运行以下命令使更改生效
newgrp docker

# 验证（应该不需要 sudo）
docker run hello-world
```

<details>
<summary>为什么不建议使用 root 运行 Docker？</summary>

Docker 守护进程绑定到 Unix socket 而不是 TCP 端口，默认由 root 拥有。如果不想在使用 docker 命令时总是使用 sudo，可以将用户添加到 docker 组。当 docker 组中的用户运行 docker 命令时，不需要使用 sudo。

**注意**：docker 组等同于 root 权限。关于这对系统安全性的影响，请参考 [Docker Daemon Attack Surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)。
</details>

## 步骤 5：拉取 龙虾 镜像

```bash
# 拉取最新版本的 龙虾 镜像
docker pull openclaw/openclaw:latest
```

验证镜像是否下载成功：

```bash
docker images | grep openclaw
```

输出示例：

```text
openclaw/openclaw   latest    abc123def456   2 days ago    500MB
```

## 步骤 6：创建配置目录

OpenClaw 需要持久化存储配置文件和数据。在主机上创建目录并挂载到容器：

```bash
# 创建配置目录
mkdir -p ~/.openclaw

# 设置权限
chmod 700 ~/.openclaw
```

## 步骤 7：运行 龙虾 容器

### 首次运行（初始化配置）

```bash
docker run -it --rm \
  -v ~/.openclaw:/root/.openclaw \
  -p 18789:18789 \
  openclaw/openclaw:latest \
  openclaw onboard
```

新手引导会配置：

- 认证（API Key、OAuth 等）
- Gateway 网关设置
- 可选的消息渠道
- 后台服务

### 作为后台服务运行

配置完成后，使用 Docker Compose 管理后台服务更方便。创建 `docker-compose.yml`：

```bash
cat > ~/.openclaw/docker-compose.yml <<'EOF'
version: '3.8'

services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: openclaw
    restart: unless-stopped
    ports:
      - "18789:18789"
    volumes:
      - ~/.openclaw:/root/.openclaw
    command: openclaw gateway
    environment:
      - TZ=Asia/Shanghai
EOF
```

启动服务：

```bash
cd ~/.openclaw
docker compose up -d
```

## 步骤 8：验证安装

```bash
# 检查容器状态
docker ps | grep openclaw

# 检查 Gateway 状态
docker exec openclaw openclaw status

# 查看 Control UI
# 如果你的系统没有 curl（常见于刚装好的 Linux）：
# sudo apt install -y curl
curl http://localhost:18789
```

如果 Control UI 能加载（`http://127.0.0.1:18789/`），你的 Gateway 网关就已准备就绪。

## 常用命令

```bash
# 查看容器日志
docker logs openclaw

# 实时查看日志
docker logs -f openclaw

# 停止服务
docker compose down

# 启动服务
docker compose up -d

# 重启服务
docker compose restart

# 升级到最新版本
docker compose pull
docker compose up -d

# 进入容器调试
docker exec -it openclaw bash

# 诊断问题
docker exec openclaw openclaw doctor
```

## 数据持久化说明

OpenClaw 容器内的配置和数据存储在 `/root/.openclaw` 目录，我们将其挂载到主机的 `~/.openclaw` 目录。这样：

- 容器删除后配置不会丢失
- 升级容器时自动继承原有配置
- 方便备份和迁移

备份配置：

```bash
# 备份配置目录
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz -C ~ .openclaw

# 恢复配置
tar -xzf openclaw-backup-20240101.tar.gz -C ~
```

<a id="failure-guide"></a>

## 失败指引（折叠）

<details>
<summary>安装或运行失败时请展开</summary>

### 1. Docker 安装失败

**GPG 密钥添加失败**

```bash
# 清理旧的密钥文件
sudo rm -f /etc/apt/keyrings/docker.gpg

# 重新添加
curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

**APT 仓库添加失败**

检查你的 Ubuntu 版本代号：

```bash
lsb_release -cs
```

如果返回的不是 `jammy`、`focal`、`noble` 等标准代号，可能需要手动指定：

```bash
# 对于 Linux Mint 等衍生版
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list
```

**依赖包冲突**

```bash
# 清理可能冲突的旧版本
sudo apt remove docker docker-engine docker.io containerd runc

# 重新安装
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

### 2. Docker 服务无法启动

```bash
# 检查服务状态
sudo systemctl status docker

# 查看详细日志
sudo journalctl -u docker.service

# 重新加载 systemd 配置
sudo systemctl daemon-reload
sudo systemctl restart docker
```

**常见原因**：

- 防火墙冲突：检查 `ufw` 或 `firewalld` 配置
- SELinux 限制（CentOS/RHEL）：临时禁用测试 `sudo setenforce 0`
- 内核版本过低：Docker 需要 3.10+ 内核

### 3. 权限问题

**错误：`permission denied while trying to connect to the Docker daemon`**

```bash
# 确保用户在 docker 组中
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker

# 验证
docker run hello-world
```

### 4. 容器无法访问网络

**错误：`network unreachable` 或 `connection refused`**

```bash
# 检查 Docker 网络
docker network ls
docker network inspect bridge

# 重建网络
docker network prune
```

**防火墙问题**：

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 18789/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --add-port=18789/tcp --permanent
sudo firewall-cmd --reload
```

### 5. 端口已被占用

**错误：`port is already allocated`**

```bash
# 查看占用端口的进程
sudo lsof -i :18789

# 停止占用端口的进程
sudo kill <PID>

# 或使用其他端口
docker run -p 18790:18789 openclaw/openclaw:latest
```

### 6. 容器启动后立即退出

```bash
# 查看退出日志
docker logs openclaw

# 检查配置文件
ls -la ~/.openclaw/

# 如果配置损坏，重置配置
rm -rf ~/.openclaw/*
docker run -it --rm -v ~/.openclaw:/root/.openclaw openclaw/openclaw:latest openclaw onboard
```

### 7. 镜像拉取失败

**国内网络问题**：

配置 Docker 镜像加速器：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 8. 磁盘空间不足

```bash
# 查看 Docker 占用空间
docker system df

# 清理未使用的资源
docker system prune -a

# 仅清理悬空镜像
docker image prune
```

### 9. 完全重置 Docker

**警告：这会删除所有容器、镜像和数据**

```bash
# 停止所有容器
docker stop $(docker ps -aq)

# 删除所有容器
docker rm $(docker ps -aq)

# 删除所有镜像
docker rmi $(docker images -q)

# 清理卷和网络
docker volume prune
docker network prune

# 备份后删除 龙虾 数据
tar -czf openclaw-backup.tar.gz ~/.openclaw
rm -rf ~/.openclaw
```

### 10. 性能问题

**内存不足**：

```bash
# 查看 Docker 资源使用
docker stats

# 限制容器内存
docker run -m 2g openclaw/openclaw:latest
```

**CPU 占用过高**：

```bash
# 限制 CPU 使用
docker run --cpus=2 openclaw/openclaw:latest
```
</details>
