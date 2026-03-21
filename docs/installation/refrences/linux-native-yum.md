# Linux 安装方法 2（YUM）：直接安装（不推荐）

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| [Docker](./linux-docker.md) | ⭐⭐⭐⭐⭐ 推荐 | 优秀 | 低 | **大多数用户的首选** |
| [直接安装 (APT)](./linux-native-apt.md) | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用服务器 |
| 直接安装 (YUM) | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用服务器 |

::: warning 重要提示
**不推荐在包含以下内容的计算机上使用此安装方式**：

- **工作相关资料**：会计财务数据、商业机密、商用资料、客户信息
- **个人隐私内容**：个人照片、文档、聊天记录、密码文件
- **敏感开发项目**：私有代码仓库、API 密钥、配置文件
- **任何你不希望暴露的数据**

**原因**：直接安装会将 OpenClaw 运行在主机系统上，如果 OpenClaw 或其依赖存在安全漏洞，可能影响系统上的所有数据。

**适用场景**：
- ✅ 专用于 OpenClaw 的独立服务器
- ✅ 临时测试环境（无敏感数据）
- ✅ 虚拟机快照环境（可随时回滚）
- ❌ 日常使用的个人电脑
- ❌ 包含任何工作或隐私数据的生产服务器

**强烈建议使用 [Docker 安装方式](./linux-docker.md)** 以获得更好的隔离性和安全性。
:::

这是传统的 Linux 安装方式，直接在主机系统上安装和运行 OpenClaw。本文档适用于 **基于 YUM/DNF 的发行版**（CentOS、RHEL、Fedora、AlmaLinux、Rocky Linux 等）。

## 确认你的系统类型

在开始之前，请确认你的系统使用的是 YUM 或 DNF 包管理器：

```bash
which yum dnf
```

如果输出包含 `/usr/bin/yum` 或 `/usr/bin/dnf`，说明你的系统使用 YUM/DNF，可以继续本文档。

如果输出为空或你使用的是 Debian、Ubuntu、Linux Mint 等系统，请参考 [Linux 安装方法 2（APT）：直接安装](./linux-native-apt.md)。

## 前置条件

- CentOS 7/8/9 或更高版本
- RHEL 7/8/9 或更高版本
- Fedora 35 或更高版本
- AlmaLinux 8/9 或更高版本
- Rocky Linux 8/9 或更高版本
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间
- root 权限或 sudo 权限

遇到任何安装失败，请直接看文末的 [失败指引](#failure-guide)。

## 步骤 1：更新系统

### CentOS / RHEL / AlmaLinux / Rocky Linux

```bash
sudo yum install -y yum-plugin-fastestmirror
sudo yum update -y
```

### Fedora

```bash
sudo dnf update -y
```

## 步骤 2：安装 curl（必做）

很多刚装好的系统默认没有 `curl`，而安装脚本需要用到它：

```bash
sudo yum install -y curl  # CentOS/RHEL/Alma/Rocky
# 或
sudo dnf install -y curl  # Fedora
```

说明：OpenClaw 官方安装脚本会在需要时自动准备运行环境，你不必手动安装或管理 Node。

## 步骤 3：安装系统依赖

OpenClaw 需要一些系统库：

### CentOS / RHEL / AlmaLinux / Rocky Linux

```bash
# 安装开发工具组
sudo yum groupinstall -y "Development Tools"
sudo yum install -y python3
```

### Fedora

```bash
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y python3
```

## 步骤 4：安装 龙虾

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装脚本会自动：

- 下载最新版本的 OpenClaw
- 安装到 `~/.local/bin/`
- 添加到 PATH

重新加载 shell 使 PATH 生效：

```bash
source ~/.bashrc
```

验证安装：

```bash
which openclaw
openclaw --version
```

## 步骤 5：启用 systemd（可选但推荐）

OpenClaw 的后台服务需要 systemd。CentOS 7+、RHEL 7+、Fedora 等默认已启用。

检查 systemd 是否可用：

```bash
systemctl --version
```

如果显示版本信息，说明 systemd 已启用。

如果 systemd 不可用（如某些容器环境），你只能以前台方式运行 OpenClaw。

## 步骤 6：运行新手引导

```bash
openclaw onboard --install-daemon
```

新手引导会配置：

- 认证（API Key、OAuth 等）
- Gateway 网关设置
- 可选的消息渠道
- 后台服务

## 步骤 7：验证安装

```bash
# 检查 Gateway 状态
openclaw status

# 打开 Control UI
openclaw dashboard
```

如果 Control UI 能加载（`http://127.0.0.1:18789/`），你的 Gateway 网关就已准备就绪。

## 常用命令

```bash
# 在前台运行 Gateway（用于调试）
openclaw gateway --port 18789

# 检查健康状态
openclaw health

# 诊断问题
openclaw doctor

# 重新配置
openclaw configure
```

## 后台服务管理

OpenClaw 使用 systemd 用户服务管理后台进程：

```bash
# 启用 lingering（防止注销后服务停止）
sudo loginctl enable-linger $USER

# 查看服务状态
systemctl --user status openclaw-gateway

# 启动/停止/重启服务
systemctl --user start openclaw-gateway
systemctl --user stop openclaw-gateway
systemctl --user restart openclaw-gateway
```

<a id="failure-guide"></a>

## 失败指引（折叠）

<details>
<summary>安装或运行失败时请展开</summary>

### 1. Node.js 安装失败


```bash
# 手动下载安装脚本
bash install_nvm.sh

# 手动添加环境变量
source ~/.bashrc
```


```bash

# 重新添加
```

**网络问题（国内）**

配置 npm 镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

### 2. 龙虾 安装脚本失败

**下载失败**

```bash
# 手动下载安装脚本
curl -fsSL https://openclaw.ai/install.sh -o install.sh
bash install.sh
```

**权限问题**

```bash
# 确保有执行权限
chmod +x install.sh
bash install.sh
```

**PATH 未生效**

```bash
# 检查 PATH
echo $PATH

# 手动添加
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 3. systemd 服务问题

**服务未找到**

```bash
# 检查服务文件
ls -la ~/.config/systemd/user/

# 重新运行 onboard
openclaw onboard --install-daemon
```

**服务无法启动**

```bash
# 查看服务日志
journalctl --user -u openclaw-gateway -f

# 检查服务状态
systemctl --user status openclaw-gateway
```

**lingering 未启用**

```bash
# 启用 lingering
sudo loginctl enable-linger $USER

# 验证
ls /var/lib/systemd/linger
```

### 4. 端口已被占用

**错误：`EADDRINUSE: address already in use`**

```bash
# 查看占用端口的进程
sudo lsof -i :18789

# 或使用 ss 命令
sudo ss -tlnp | grep 18789

# 停止占用端口的进程
sudo kill <PID>

# 或使用其他端口
openclaw gateway --port 18790
```

### 5. 权限问题

**无法写入配置文件**

```bash
# 检查配置目录权限
ls -la ~/.openclaw

# 修复权限
chmod 700 ~/.openclaw
chown -R $USER:$USER ~/.openclaw
```

**SELinux 阻止**

CentOS/RHEL 默认启用 SELinux，可能阻止某些操作：

```bash
# 检查 SELinux 状态
getenforce

# 临时设置为宽容模式（仅用于调试）
sudo setenforce 0

# 永久禁用（不推荐）
sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

### 6. Node 版本不兼容

**错误：`The engine "node" is incompatible`**

```bash
# 检查当前版本
node --version

# 安装兼容版本
```

### 7. 依赖安装失败

**开发工具缺失**

```bash
# CentOS/RHEL/AlmaLinux/Rocky
sudo yum groupinstall -y "Development Tools"
sudo yum install -y python3

# Fedora
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y python3
```

### 8. 内存不足

**错误：`JavaScript heap out of memory`**

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 或在运行时指定
NODE_OPTIONS="--max-old-space-size=4096" openclaw gateway
```

### 9. 防火墙问题

**端口无法访问**

```bash
# 检查防火墙状态
sudo firewall-cmd --state

# 开放端口
sudo firewall-cmd --add-port=18789/tcp --permanent
sudo firewall-cmd --reload

# 验证
sudo firewall-cmd --list-ports
```

### 10. 完全重置

**警告：这会删除所有配置**

```bash
# 停止服务
systemctl --user stop openclaw-gateway

# 备份配置（可选）
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw

# 删除配置
rm -rf ~/.openclaw

# 删除 龙虾
npm uninstall -g openclaw || true

# 清理服务文件
rm -f ~/.config/systemd/user/openclaw-*.service
systemctl --user daemon-reload

# 重新安装
curl -fsSL https://openclaw.ai/install.sh | bash
source ~/.bashrc
openclaw onboard --install-daemon
```

### 11. 性能问题

**CPU 占用过高**

```bash
# 检查系统资源
top -p $(pgrep -f openclaw)

# 限制 CPU 使用（需要 cpulimit）
sudo yum install -y cpulimit  # 或 sudo dnf install -y cpulimit
cpulimit -l 50 -p $(pgrep -f openclaw)
```

**内存占用过高**

```bash
# 检查内存使用
ps aux | grep openclaw

# 限制内存（使用 systemd）
mkdir -p ~/.config/systemd/user/openclaw-gateway.service.d
cat > ~/.config/systemd/user/openclaw-gateway.service.d/limits.conf <<EOF
[Service]
MemoryMax=2G
EOF

systemctl --user daemon-reload
systemctl --user restart openclaw-gateway
```

### 12. EPEL 仓库问题（CentOS/RHEL）

某些软件包需要 EPEL 仓库：

```bash
# CentOS 7
sudo yum install -y epel-release

# CentOS 8 / Rocky / Alma
sudo yum install -y epel-release
# 或
sudo dnf install -y epel-release

# RHEL
sudo subscription-manager repos --enable codeready-builder-for-rhel-8-x86_64-rpms
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
```
</details>
