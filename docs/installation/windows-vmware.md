# Windows 安装方法 2：VMware 虚拟机

如果你不想使用 WSL2，或者需要更完整的 Linux 环境，可以使用 VMware 虚拟机安装 OpenClaw。这种方式提供了更好的隔离性和灵活性。

## 前置条件

- Windows 10/11 64 位
- 启用虚拟化功能（BIOS/UEFI 中）
- 至少 8GB 内存（推荐 16GB）
- 至少 50GB 可用磁盘空间

## 步骤 1：下载并安装 VMware

### VMware Workstation Player（免费）

1. 访问 [VMware 官网](https://www.vmware.com/products/workstation-player.html)
2. 下载 VMware Workstation Player
3. 运行安装程序，按提示完成安装

### VMware Workstation Pro（付费，功能更全）

1. 访问 [VMware 官网](https://www.vmware.com/products/workstation-pro.html)
2. 下载并安装

## 步骤 2：下载 Linux 镜像

推荐使用 **Ubuntu 22.04 LTS** 或 **Ubuntu 24.04 LTS**：

- 官方下载：[Ubuntu Desktop](https://ubuntu.com/download/desktop)
- 国内镜像：[清华源](https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/)

## 步骤 3：创建虚拟机

1. 打开 VMware，点击 **创建新虚拟机**
2. 选择 **使用 ISO 映像文件**，浏览选择下载的 Ubuntu ISO
3. 设置虚拟机信息：
   - 虚拟机名称：`OpenClaw-Ubuntu`
   - 用户名/密码：设置你的登录凭据
4. 配置硬件：
   - 内存：至少 4GB（推荐 8GB）
   - 处理器：至少 2 核
   - 硬盘：至少 40GB（推荐动态分配）
   - 网络：NAT 或桥接模式
5. 点击 **完成** 创建虚拟机

## 步骤 4：安装 Ubuntu

1. 启动虚拟机
2. 按照安装向导完成 Ubuntu 安装
3. 安装完成后重启虚拟机

## 步骤 5：安装 VMware Tools（重要）

VMware Tools 提供更好的性能和功能：

```bash
# 在 Ubuntu 中
sudo apt update
sudo apt install open-vm-tools open-vm-tools-desktop
sudo reboot
```

## 步骤 6：更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

## 步骤 7：安装 Node.js

推荐使用 Node 24（最低支持 Node 22 LTS `22.16+`）。

### 方法 A：使用 nvm（推荐）

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 重新加载 shell
source ~/.bashrc

# 安装 Node 24
nvm install 24
nvm use 24
```

### 方法 B：使用 NodeSource

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

验证安装：

```bash
node --version
npm --version
```

## 步骤 8：安装 OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装脚本会自动：
- 下载最新版本的 OpenClaw
- 安装到 `~/.local/bin/`
- 添加到 PATH

重新加载 shell：

```bash
source ~/.bashrc
```

## 步骤 9：运行新手引导

```bash
openclaw onboard --install-daemon
```

新手引导会配置：
- 认证（API Key、OAuth 等）
- Gateway 网关设置
- 可选的消息渠道
- 后台服务

## 步骤 10：验证安装

```bash
# 检查 Gateway 状态
openclaw gateway status

# 打开 Control UI
openclaw dashboard
```

## 网络配置

### NAT 模式（默认）

虚拟机通过宿主机访问网络。从 Windows 访问虚拟机服务：

```bash
# 在虚拟机中查看 IP
ip addr show
```

然后在 Windows 浏览器访问：`http://<虚拟机IP>:18789/`

### 桥接模式

虚拟机获得独立 IP，与宿主机在同一网络：

1. VMware 设置 → 网络适配器 → 桥接模式
2. 重启虚拟机网络

```bash
sudo systemctl restart NetworkManager
```

## 后台服务管理

```bash
# 启用 lingering（防止注销后服务停止）
sudo loginctl enable-linger $USER

# 查看服务状态
systemctl --user status openclaw-gateway

# 启动/停止/重启
systemctl --user start openclaw-gateway
systemctl --user stop openclaw-gateway
systemctl --user restart openclaw-gateway
```

## 快照与备份

VMware 支持虚拟机快照，方便备份和恢复：

1. 虚拟机 → 快照 → 拍摄快照
2. 命名并保存

恢复快照：虚拟机 → 快照 → 选择快照 → 恢复

## 常见问题

### 虚拟机性能慢

- 增加分配的内存和 CPU 核心数
- 启用 3D 加速（设置 → 显示器）
- 使用 SSD 存储虚拟机文件

### 网络连接问题

```bash
# 重启网络服务
sudo systemctl restart NetworkManager

# 检查 DNS
sudo resolvectl status
```

### 文件共享

- **共享文件夹**：VMware 设置 → 选项 → 共享文件夹
- **拖放**：需要安装 VMware Tools
- **剪贴板共享**：需要安装 VMware Tools

## 优缺点

### 优点

- 完整的 Linux 环境
- 快照功能，方便回滚
- 资源隔离
- 可以运行其他 Linux 应用

### 缺点

- 资源占用较高
- 需要单独管理虚拟机
- 网络配置相对复杂

## 下一步

- [配置消息渠道](/integrations/feishu.html)
- [了解 onboard 命令](/guides/onboard.html)
- [私信安全和批准](https://docs.openclaw.ai/pairing)
