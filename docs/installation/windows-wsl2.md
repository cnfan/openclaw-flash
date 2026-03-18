# Windows 安装方法 1：WSL2（推荐）

这是官方推荐的 Windows 安装方式。通过 **WSL2**（Windows Subsystem for Linux 2），你可以在 Windows 上运行完整的 Linux 环境，获得最佳兼容性和性能。

## WSL1 与 WSL2 的区别

| 特性 | WSL1 | WSL2 |
|------|------|------|
| 架构 | 翻译层 | 真实 Linux 内核 |
| 文件系统性能 | 较慢 | 接近原生 |
| Docker 支持 | 不支持 | 完整支持 |
| systemd 支持 | 不支持 | 支持 |
| 内存占用 | 较低 | 稍高（动态分配） |

**OpenClaw 需要 WSL2**，因为它依赖 systemd 来管理后台服务。

## 前置条件

- Windows 10 版本 2004+（内部版本 19041 及更高）或 Windows 11
- 启用虚拟化功能（BIOS/UEFI 中）
- 管理员权限

## 步骤 1：安装 WSL2

以**管理员身份**打开 PowerShell，运行：

```powershell
wsl --install --no-distribution
```

这会自动：
- 启用 WSL 和虚拟机平台功能
- 下载并安装 WSL2 Linux 内核更新包
- 将 **WSL 2 设置为默认版本**

安装完成后，**重启计算机**。

::: tip 查看可用发行版
如果想先查看有哪些发行版可以安装：

```powershell
wsl --list --online
```
:::

### 确保使用 WSL2

如果你之前安装过 WSL1，需要确保使用的是 WSL2：

```powershell
# 查看已安装的发行版及其版本
wsl --list --verbose
```

输出应该显示 `VERSION` 为 `2`：

```
  NAME            STATE           VERSION
* Ubuntu-24.04    Running         2
```

如果显示为 `1`，需要手动转换：

```powershell
# 将发行版转换为 WSL2
wsl --set-version Ubuntu-24.04 2

# 设置 WSL2 为默认版本（新安装的发行版将使用 WSL2）
wsl --set-default-version 2
```

## 步骤 2：安装 Ubuntu

重启计算机后，查看可用的发行版列表：

```powershell
wsl --list --online
```

输出示例：
```
以下是可安装的有效分发列表。
使用 'wsl --install -d <Distro>' 安装。
  NAME                            FRIENDLY NAME
  Ubuntu                          Ubuntu
  Ubuntu-24.04                    Ubuntu 24.04 LTS
  Ubuntu-22.04                    Ubuntu 22.04 LTS
  Ubuntu-20.04                    Ubuntu 20.04 LTS
  ...
```

推荐安装 **Ubuntu 24.04 LTS**：

```powershell
wsl --install -d Ubuntu-24.04
```

### 首次启动配置

首次启动 Ubuntu 时，需要完成初始化设置：

1. **等待安装完成**：首次启动需要解压文件系统，可能需要几分钟
2. **创建用户账户**：
   - 输入 UNIX 用户名（建议使用小写字母，不含空格）
   - 输入密码（输入时不会显示，这是正常的）
   - 再次确认密码

示例：
```
Enter new UNIX username: myuser
New password:
Retype new password:
passwd: password updated successfully
Installation successful!
```

### 手动启动 WSL2

你可以通过以下方式启动：

```powershell
# 启动默认发行版
wsl

# 启动指定发行版
wsl -d Ubuntu-24.04
```

或者在 Windows 开始菜单中搜索 "Ubuntu" 并点击启动。

### 设置默认发行版

如果你安装了多个发行版，可以设置默认：

```powershell
wsl --set-default Ubuntu-24.04
```

## 步骤 3：WSL2 配置优化（可选）

创建 `.wslconfig` 文件来优化 WSL2 性能。在 Windows 用户目录下创建 `C:\Users\<用户名>\.wslconfig`：

```ini
[wsl2]
# 内存限制（可选，WSL2 会动态分配）
memory=4GB

# 处理器限制（可选）
processors=4

# 交换空间
swap=2GB

# 本地化主机地址（允许通过 localhost 访问）
localhostForwarding=true

# 自动代理（使用 Windows 的代理设置）
autoProxy=true
```

修改后需要重启 WSL2：

```powershell
wsl --shutdown
wsl
```

## 步骤 4：启用 systemd

WSL2 支持 systemd，OpenClaw 的后台服务需要它。

检查 systemd 是否已启用：

```bash
systemctl --version
```

如果显示版本信息，说明 systemd 已启用。

如果 systemd 未启用，创建或编辑 `/etc/wsl.conf`：

```bash
sudo nano /etc/wsl.conf
```

添加以下内容：

```ini
[boot]
systemd=true
```

保存后，在 PowerShell 中重启 WSL2：

```powershell
wsl --shutdown
wsl
```

再次进入 Ubuntu，验证 systemd：

```bash
systemctl --version
```

## 步骤 5：更新系统

进入 WSL2 后，更新软件包：

```bash
sudo apt update && sudo apt upgrade -y
```

## 步骤 6：安装 Node.js

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

## 步骤 7：安装 OpenClaw

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

## 步骤 8：运行新手引导

```bash
openclaw onboard --install-daemon
```

新手引导会配置：
- 认证（API Key、OAuth 等）
- Gateway 网关设置
- 可选的消息渠道
- 后台服务

## 步骤 9：验证安装

```bash
# 检查 Gateway 状态
openclaw gateway status

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

## 常见问题

### 如何确认我使用的是 WSL2？

```powershell
wsl --list --verbose
```

确保 `VERSION` 列显示 `2`。

### WSL2 无法启动

```powershell
# 关闭 WSL2
wsl --shutdown

# 重新启动
wsl
```

如果仍然失败，检查虚拟化是否启用：

```powershell
systeminfo | findstr /i "虚拟化"
```

### 网络问题

WSL2 使用虚拟网络适配器，IP 地址可能与 Windows 不同：

```bash
# 查看 WSL2 的 IP 地址
ip addr show eth0
```

从 Windows 访问 WSL2 服务使用 `localhost`：

```powershell
# 在 Windows 浏览器中访问
http://localhost:18789
```

### 文件访问

- 从 Windows 访问 WSL2 文件：`\\wsl$\Ubuntu-24.04\home\<用户名>`
- 从 WSL2 访问 Windows 文件：`/mnt/c/Users/<用户名>/`

::: warning 注意
不要在 Windows 文件系统（`/mnt/c/`）中运行 Node.js 项目，性能会很差。建议在 WSL2 的 Linux 文件系统（`~/`）中工作。
:::

### 内存占用过高

WSL2 会动态分配内存，但可能不会立即释放。可以配置 `.wslconfig` 限制内存：

```ini
[wsl2]
memory=4GB
```

### 重新安装 Ubuntu

```powershell
# 注销当前发行版（会删除所有数据）
wsl --unregister Ubuntu-24.04

# 重新安装
wsl --install -d Ubuntu-24.04
```

## 下一步

- [配置消息渠道](/integrations/feishu.html)
- [了解 onboard 命令](/guides/onboard.html)
- [私信安全和批准](https://docs.openclaw.ai/pairing)

## 官方参考

- [OpenClaw 入门指南](https://docs.openclaw.ai/zh-CN/start/getting-started)
- [CLI 新手引导](https://docs.openclaw.ai/start/wizard)
- [WSL2 官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/)
- [WSL 配置设置](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)
