# macOS 安装方法 2：直接安装（不推荐）

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| [Docker](./macos-docker.md) | ⭐⭐⭐⭐⭐ 推荐 | 优秀 | 可忽略 | **大多数用户的首选** |
| 直接安装 | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用 Mac |

::: warning 重要提示
**不推荐在包含以下内容的 Mac 上使用此安装方式**：

- **工作相关资料**：会计财务数据、商业机密、商用资料、客户信息
- **个人隐私内容**：个人照片、文档、聊天记录、密码文件、钥匙串数据
- **敏感开发项目**：私有代码仓库、API 密钥、配置文件、SSH 密钥
- **iCloud 同步数据**：备忘录、提醒事项、日历、通讯录
- **任何你不希望暴露的数据**

**原因**：直接安装会将 OpenClaw 运行在 macOS 主系统上，如果 OpenClaw 或其依赖存在安全漏洞，可能影响系统上的所有数据，包括：
- 访问用户的文件系统
- 读取环境变量中的敏感信息
- 潜在影响其他正在运行的应用

**适用场景**：
- ✅ 专用于 OpenClaw 的独立 Mac（如 Mac mini 服务器）
- ✅ 临时测试环境（无敏感数据）
- ✅ 可随时重装系统的开发机
- ❌ 日常使用的个人 Mac
- ❌ 包含任何工作或隐私数据的生产 Mac
- ❌ 公司配发的办公 Mac

**强烈建议使用 [Docker 安装方式](./macos-docker.md)** 以获得更好的隔离性和安全性。
:::

这是传统的 macOS 安装方式，直接在系统上安装和运行 OpenClaw。

## 前置条件

- macOS 12 (Monterey) 或更高版本
- Apple Silicon (M1/M2/M3) 或 Intel 芯片
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间
- 管理员权限

遇到任何安装失败，请直接看文末的 [失败指引](#failure-guide)。

## 步骤 1：安装 Xcode Command Line Tools

```bash
xcode-select --install
```

这会弹出一个对话框，点击"安装"。等待安装完成（可能需要几分钟）。

验证安装：

```bash
xcode-select -p
```

判断"没问题"可以看这几点：

- 输出 `/Library/Developer/CommandLineTools` 或 `/Applications/Xcode.app/Contents/Developer`
- 没有 "command not found" 错误

## 步骤 2：安装 Homebrew（如果未安装）

[Homebrew](https://brew.sh/) 是 macOS 的包管理器，用于安装 Node.js 等依赖。

先配置 Homebrew 国内镜像环境变量：

```bash
echo 'export HOMEBREW_API_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api' >> ~/.zshrc
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```

检查是否已安装：

```bash
which brew
```

如果未安装，运行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Apple Silicon Mac 额外步骤**：

安装完成后，需要将 Homebrew 添加到 PATH：

```bash
# 对于 Apple Silicon Mac
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

验证安装：

```bash
brew --version
```

示例输出：

```text
Homebrew 4.2.0
```

## 步骤 3：准备安装环境

官方安装脚本会在需要时自动准备运行环境，你不必手动安装或管理 Node。

## 步骤 4：安装 龙虾

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装脚本会自动：

- 下载最新版本的 OpenClaw
- 完成安装并让 `openclaw` 命令可用

重新加载 shell 使 PATH 生效：

```bash
# zsh 用户
source ~/.zshrc

# bash 用户
source ~/.bash_profile
```

验证安装：

```bash
which openclaw
openclaw --version
```

## 步骤 5：配置 launchd（可选）

macOS 使用 `launchd` 管理后台服务，类似于 Linux 的 systemd。

如果你需要开机自启/后台运行，后续可以在配置完成后，再按本文后面的“launchd 管理”章节来开启。

## 步骤 6：运行新手引导

如果你是通过 `curl -fsSL https://openclaw.ai/install.sh | bash` 安装的，安装流程通常会在最后直接进入一次 `onboard` 的快速设置。

只有在你当时跳过了/中途退出了向导时，才需要手动执行：

```bash
openclaw onboard
```

建议先参考我们的 [快速设置](../quick-start.md) 提前准备好大模型 API Key，并优先完成 API Key 这一项，其它配置后面再补。

新手引导会配置：

- 认证（API Key、OAuth 等）
- Gateway 网关设置
- 可选的消息渠道
- 后台服务

## 步骤 7：验证安装

```bash
# 检查 Gateway 状态
openclaw status

# 打开 Control UI（在默认浏览器中）
open http://localhost:18789
```

如果 Control UI 能加载（`http://127.0.0.1:18789/`），你的 Gateway 网关就已准备就绪。

## PATH 诊断与修复

如果你遇到 `openclaw: command not found`，按顺序执行下面命令快速定位：

```bash
node -v
npm -v
npm prefix -g
echo "$PATH"
```

如果 `$(npm prefix -g)/bin` 不在你的 `$PATH` 中，shell 就找不到全局 npm 二进制文件（包括 `openclaw`）。

修复方式：把下面这一行加入你的 shell 启动文件（`~/.zshrc` 或 `~/.bashrc`），然后重新打开终端：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

## 常用命令

```bash
# 诊断问题
openclaw doctor

# 查看 Gateway 状态
openclaw status

# 打开浏览器 UI
openclaw dashboard

# 重新配置
openclaw configure
```

如需临时以前台方式运行 Gateway（用于调试/改端口），再使用：

```bash
openclaw gateway --port 18789
```

## 后台服务管理

OpenClaw 使用 launchd 管理后台进程：

```bash
# 查看服务状态
launchctl list | grep openclaw

# 启动服务
launchctl load ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 停止服务
launchctl unload ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 重启服务
launchctl unload ~/Library/LaunchAgents/com.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/com.openclaw.gateway.plist
```

<a id="failure-guide"></a>

## 失败指引（折叠）

<details>
<summary>安装或运行失败时请展开</summary>

### 1. Xcode Command Line Tools 安装失败

**安装卡住或超时**

```bash
# 取消当前安装
sudo rm -rf /Library/Developer/CommandLineTools

# 重新安装
xcode-select --install
```

**权限问题**

```bash
# 重置开发者目录
sudo xcode-select --reset

# 重新安装
xcode-select --install
```

**软件更新服务器不可用**

稍后重试，或从 Apple 开发者网站手动下载：https://developer.apple.com/download/more/

### 2. Homebrew 安装失败

**网络问题（国内）**

```bash
# 使用国内镜像
/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
```

**权限问题**

```bash
# 不要使用 sudo 安装 Homebrew
# 如果之前使用 sudo 安装，需要卸载重装
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Apple Silicon PATH 问题**

```bash
# 手动添加到 PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# 验证
which brew
```

### 3. Node/命令环境问题

如果遇到 `node: command not found` 或 `openclaw: command not found`，优先按本文的「PATH 诊断与修复」排查。

### 4. 龙虾 安装脚本失败

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

# 手动添加（按 npm 全局前缀修复）
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# bash 用户
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

### 5. launchd 服务问题

**服务未启动**

```bash
# 检查服务文件
ls -la ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 查看服务日志
tail -f ~/Library/Logs/OpenClaw/gateway.log

# 手动加载服务
launchctl load ~/Library/LaunchAgents/com.openclaw.gateway.plist
```

**服务启动后立即退出**

```bash
# 查看错误信息
launchctl list | grep openclaw

# 检查配置文件
cat ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 重新运行 onboard
openclaw onboard
```

**权限被拒绝**

```bash
# 确保 plist 文件权限正确
chmod 644 ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 确保可执行文件权限正确
chmod +x "$(command -v openclaw)"
```

### 6. 端口已被占用

**错误：`EADDRINUSE: address already in use`**

```bash
# 查看占用端口的进程
lsof -i :18789

# 停止占用端口的进程
kill -9 <PID>

# 或使用其他端口
openclaw gateway --port 18790
```

### 7. 权限问题

**无法写入配置文件**

```bash
# 检查配置目录权限
ls -la ~/.openclaw

# 修复权限
chmod 700 ~/.openclaw
chown -R $(whoami) ~/.openclaw
```

**macOS 安全限制**

如果 macOS 阻止 OpenClaw 运行：

1. 系统偏好设置 → 安全性与隐私 → 通用
2. 点击"仍要打开"或"允许"
3. 或在终端运行：

```bash
# 移除隔离属性
sudo xattr -cr "$(command -v openclaw)"
```

### 8. Node 版本不兼容

**错误：`The engine "node" is incompatible`**

建议直接重新运行官方安装脚本（它会在需要时准备兼容的 Node 环境）：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 9. 内存不足

**错误：`JavaScript heap out of memory`**

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 或在运行时指定
NODE_OPTIONS="--max-old-space-size=4096" openclaw gateway

# 永久设置（zsh）
echo 'export NODE_OPTIONS="--max-old-space-size=4096"' >> ~/.zshrc
source ~/.zshrc
```

### 10. 完全重置

**警告：这会删除所有配置**

```bash
# 停止服务
launchctl unload ~/Library/LaunchAgents/com.openclaw.gateway.plist 2>/dev/null

# 备份配置（可选）
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw

# 删除配置
rm -rf ~/.openclaw

# 删除 龙虾
npm uninstall -g openclaw || true

# 删除服务文件
rm -f ~/Library/LaunchAgents/com.openclaw.*.plist

# 重新安装
curl -fsSL https://openclaw.ai/install.sh | bash
source ~/.zshrc  # 或 source ~/.bash_profile

# 如需重新做一次快速设置（仅当你跳过/中途退出过）
openclaw onboard
```

### 11. 性能问题

**CPU 占用过高**

```bash
# 检查进程资源使用
top -pid $(pgrep -f openclaw)

# 使用活动监视器监控
open -a "Activity Monitor"
```

**内存占用过高**

```bash
# 检查内存使用
ps aux | grep openclaw

# 限制内存（需要在 launchd plist 中配置）
# 编辑 ~/Library/LaunchAgents/com.openclaw.gateway.plist
# 添加 HardMemoryLimit 和 SoftMemoryLimit
```

### 12. 卸载 龙虾

**完全卸载**

```bash
# 停止并卸载服务
launchctl unload ~/Library/LaunchAgents/com.openclaw.gateway.plist 2>/dev/null

# 删除文件
rm -rf ~/.openclaw
npm uninstall -g openclaw || true
rm -f ~/Library/LaunchAgents/com.openclaw.*.plist
rm -rf ~/Library/Logs/OpenClaw

# 从 PATH 中移除（编辑 ~/.zshrc 或 ~/.bash_profile）
# 删除包含 .local/bin 的行

# 重新加载配置
source ~/.zshrc  # 或 source ~/.bash_profile
```
</details>
