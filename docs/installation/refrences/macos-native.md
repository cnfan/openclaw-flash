# macOS 安装方法 2：直接安装（不推荐）

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| [Docker](./macos-docker.md) | ⭐⭐⭐⭐⭐ 推荐 | 优秀 | 中等 | **大多数用户的首选** |
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

## 步骤 3：安装 Node.js

推荐使用 Node 24（最低支持 Node 22 LTS `22.16+`）。

### 方法 A：使用 nvm（推荐）

```bash
# 安装 nvm
curl -fsSL https://gitee.com/mirrors/nvm/raw/v0.40.1/install.sh | bash

# 重新加载 shell（zsh 用户）
source ~/.zshrc

# 如果使用 bash
source ~/.bash_profile

# 配置 Node 下载镜像与 npm 镜像
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
npm config set registry https://registry.npmmirror.com

# 安装 Node 24
nvm install 24
nvm use 24
```

### 方法 B：使用 Homebrew

```bash
brew install node@24
```

验证安装：

```bash
node --version
npm --version
```

判断"没问题"可以看这几点：

- `node --version` 输出 `v24.x.x` 或 `v22.x.x`（22.16+）
- `npm --version` 输出 `10.x.x` 或更高版本

示例输出：

```text
$ node --version
v24.0.0

$ npm --version
10.8.1
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

## 步骤 5：配置 launchd（可选但推荐）

macOS 使用 `launchd` 管理后台服务，类似于 Linux 的 systemd。

运行新手引导时会自动配置：

```bash
openclaw onboard --install-daemon
```

这会创建 `~/Library/LaunchAgents/com.openclaw.gateway.plist` 文件。

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
openclaw gateway status

# 打开 Control UI（在默认浏览器中）
open http://localhost:18789
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

### 3. Node.js 安装失败

**nvm 安装失败**

```bash
# 手动下载安装脚本
curl -fsSL https://gitee.com/mirrors/nvm/raw/v0.40.1/install.sh -o install_nvm.sh
bash install_nvm.sh

# 手动添加环境变量（zsh）
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
```

**Homebrew 安装 Node.js 失败**

```bash
# 更新 Homebrew
brew update

# 清理旧版本
brew uninstall node
brew cleanup

# 重新安装
brew install node@24
```

**权限问题**

```bash
# 修复 npm 权限
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Apple Silicon 兼容性**

```bash
# 如果遇到架构问题，使用 Rosetta 安装
arch -x86_64 brew install node@24
```

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

# 手动添加（zsh）
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
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
openclaw onboard --install-daemon
```

**权限被拒绝**

```bash
# 确保 plist 文件权限正确
chmod 644 ~/Library/LaunchAgents/com.openclaw.gateway.plist

# 确保可执行文件权限正确
chmod +x ~/.local/bin/openclaw
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
sudo xattr -cr ~/.local/bin/openclaw
```

### 8. Node 版本不兼容

**错误：`The engine "node" is incompatible`**

```bash
# 检查当前版本
node --version

# 安装兼容版本
nvm install 24
nvm use 24
nvm alias default 24
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
rm -rf ~/.local/bin/openclaw

# 删除服务文件
rm -f ~/Library/LaunchAgents/com.openclaw.*.plist

# 重新安装
curl -fsSL https://openclaw.ai/install.sh | bash
source ~/.zshrc  # 或 source ~/.bash_profile
openclaw onboard --install-daemon
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
rm -rf ~/.local/bin/openclaw
rm -f ~/Library/LaunchAgents/com.openclaw.*.plist
rm -rf ~/Library/Logs/OpenClaw

# 从 PATH 中移除（编辑 ~/.zshrc 或 ~/.bash_profile）
# 删除包含 .local/bin 的行

# 重新加载配置
source ~/.zshrc  # 或 source ~/.bash_profile
```
</details>
