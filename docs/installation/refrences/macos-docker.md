# macOS 安装方法 1：Docker 安装（推荐）

这是官方推荐的 macOS 安装方式。通过 **Docker Desktop** 容器技术，你可以获得最佳的隔离性和安全性，避免与系统其他软件冲突。

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| Docker | ⭐⭐⭐⭐⭐ 推荐 | 优秀 | 中等 | **大多数用户的首选** |
| [直接安装](/installation/refrences/macos-native.html) | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用 Mac |

## 为什么推荐 Docker 安装？

- **环境隔离**：OpenClaw 运行在独立容器中，不影响 macOS 系统
- **易于管理**：一键启动、停止、升级
- **可重复性**：在任何 Mac 上获得一致的运行环境
- **安全性**：容器隔离降低潜在风险
- **易于卸载**：删除容器即可完全清理，不留系统残留

## 前置条件

- macOS 12 (Monterey) 或更高版本
- Apple Silicon (M1/M2/M3) 或 Intel 芯片
- 至少 4GB 可用内存
- 至少 15GB 可用磁盘空间
- 管理员权限

遇到任何安装失败，请直接看文末的 [失败指引](#failure-guide)。

## 步骤 1：安装 Docker Desktop

先执行共享安装步骤：

- [Docker 安装（共享步骤）](/installation/refrences/docker-install.html)

在共享页中，选择“macOS 安装 Docker Desktop”章节执行完成后，再继续本页后续步骤。

## 步骤 2：启动 Docker Desktop

首次启动 Docker Desktop 时：

1. **授权权限**：macOS 会请求管理员权限以安装网络组件
2. **完成设置向导**：按照提示完成初始设置（可跳过教程）
3. **等待启动**：菜单栏出现 Docker 鲸鱼图标，表示 Docker 正在运行

判断"没问题"可以看这几点：

- 菜单栏出现 Docker 鲸鱼图标（不闪烁）
- 点击图标显示 "Docker Desktop is running"
- 终端运行 `docker --version` 能正常输出版本号

示例输出：

```text
Docker version 27.0.0, build 1234567
```

## 步骤 3：配置 Docker 镜像加速（推荐先做）

点击菜单栏 Docker 图标 → Settings (Preferences) 进行配置：

**资源分配**：

- **Memory**：建议 4GB 以上
- **CPUs**：建议 2 核以上
- **Disk image size**：建议 64GB 以上

**Docker Engine 配置**：

在 Docker Engine 设置中添加国内镜像加速器（如果网络较慢）：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io"
  ]
}
```

点击 "Apply & Restart" 使配置生效。

## 步骤 4：验证 Docker 安装

打开终端（Terminal 或 iTerm2），运行：

```bash
# 检查 Docker 版本
docker --version

# 运行测试容器
docker run hello-world
```

如果看到 "Hello from Docker!" 消息，说明 Docker 已正确安装。

## 步骤 5：拉取 OpenClaw 镜像

```bash
# 拉取最新版本的 OpenClaw 镜像
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

## 步骤 7：运行 OpenClaw 容器

### 首次运行（初始化配置）

```bash
docker run -it --rm \
  -v ~/.openclaw:/root/.openclaw \
  -p 18789:18789 \
  openclaw/openclaw:latest \
  openclaw onboard --install-daemon
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
docker exec openclaw openclaw gateway status

# 在浏览器中打开 Control UI
open http://localhost:18789
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

### 1. Docker Desktop 安装失败

**"Docker Desktop is damaged" 错误**

macOS 安全机制可能阻止未签名应用：

```bash
# 移除隔离属性
sudo xattr -cr /Applications/Docker.app
```

**Apple Silicon 安装问题**

确保下载了正确版本：

- 检查芯片：点击苹果菜单 → "关于本机"
- M1/M2/M3 芯片：下载 "Mac with Apple silicon" 版本
- Intel 芯片：下载 "Mac with Intel chip" 版本

**Homebrew 安装失败**

```bash
# 更新 Homebrew
brew update

# 清理旧版本
brew uninstall docker
brew install --cask docker
```

### 2. Docker Desktop 无法启动

**虚拟化未启用**

Apple Silicon Mac：

- 确保 macOS 为 12.0 或更高版本
- 重启 Mac 并按住电源键进入恢复模式
- 在"实用工具"中启用虚拟化

Intel Mac：

- 重启并按住 Command+R 进入恢复模式
- 打开"终端"，运行 `csrutil enable`
- 重启

**权限问题**

```bash
# 重置 Docker 权限
sudo /Applications/Docker.app/Contents/MacOS/Docker --uninstall
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker

# 重新安装
open /Applications/Docker.app
```

**网络问题**

```bash
# 重置 Docker 网络
# 在 Docker Desktop 菜单中：Troubleshoot → Reset to factory defaults
```

### 3. 容器无法启动

**端口已被占用**

```bash
# 查看占用端口的进程
lsof -i :18789

# 停止占用端口的进程
kill -9 <PID>

# 或使用其他端口
docker run -p 18790:18789 openclaw/openclaw:latest
```

**权限问题**

```bash
# 确保配置目录权限正确
chmod 700 ~/.openclaw
ls -la ~/.openclaw
```

### 4. 性能问题

**内存不足**

调整 Docker Desktop 资源分配：

1. 点击菜单栏 Docker 图标 → Settings
2. 进入 Resources 标签
3. 增加 Memory 到 4GB 或更多
4. 点击 "Apply & Restart"

**磁盘空间不足**

```bash
# 查看 Docker 占用空间
docker system df

# 清理未使用的资源
docker system prune -a

# 在 Docker Desktop 中清理
# Settings → Resources → Advanced → Clean / Purge data
```

**Apple Silicon 性能问题**

确保使用 arm64 镜像：

```bash
# 检查镜像架构
docker inspect openclaw/openclaw:latest | grep Architecture

# 应该输出 "arm64" 或 "amd64"（通过 Rosetta 运行）
```

### 5. 网络连接问题

**无法拉取镜像**

配置镜像加速器：

1. Docker Desktop → Settings → Docker Engine
2. 添加配置：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live"
  ]
}
```

3. 点击 "Apply & Restart"

**VPN 冲突**

如果使用 VPN：

- 在 Docker Desktop → Settings → Resources → Network 中配置代理
- 或临时禁用 VPN 测试

### 6. 镜像拉取失败

**网络超时**

```bash
# 重试拉取
docker pull openclaw/openclaw:latest

# 如果持续失败，尝试使用代理
docker pull --platform linux/amd64 openclaw/openclaw:latest
```

**镜像损坏**

```bash
# 删除本地镜像
docker rmi openclaw/openclaw:latest

# 重新拉取
docker pull openclaw/openclaw:latest
```

### 7. 容器启动后立即退出

```bash
# 查看退出日志
docker logs openclaw

# 检查配置文件
ls -la ~/.openclaw/

# 如果配置损坏，重置配置
rm -rf ~/.openclaw/*
docker run -it --rm -v ~/.openclaw:/root/.openclaw openclaw/openclaw:latest openclaw onboard
```

### 8. macOS 防火墙阻止连接

**系统偏好设置 → 安全性与隐私 → 防火墙**

1. 点击"防火墙选项"
2. 确保 "Docker" 允许传入连接
3. 或临时关闭防火墙测试

### 9. 完全重置 Docker Desktop

**警告：这会删除所有容器、镜像和数据**

1. 点击菜单栏 Docker 图标 → Troubleshoot
2. 选择 "Reset to factory defaults"
3. 确认重置
4. 备份并删除 OpenClaw 数据：

```bash
tar -czf openclaw-backup.tar.gz ~/.openclaw
rm -rf ~/.openclaw
```

### 10. 卸载并重新安装 Docker Desktop

```bash
# 停止 Docker Desktop
# 在菜单栏点击 Docker 图标 → Quit Docker Desktop

# 卸载
/Applications/Docker.app/Contents/MacOS/Docker --uninstall

# 清理残留文件
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
rm -rf ~/Library/HTTPStorages/com.docker.docker

# 重新下载并安装
# 访问 https://www.docker.com/products/docker-desktop/
```
</details>
