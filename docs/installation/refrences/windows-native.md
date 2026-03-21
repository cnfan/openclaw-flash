# Windows 安装方法 3：直接安装（不推荐）

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| [WSL2](./windows-wsl2.md) | ⭐⭐⭐⭐⭐ 推荐 | 良好 | 低 | **大多数用户的首选** |
| [VMware 虚拟机](./windows-vmware.md) | ⭐⭐⭐⭐ 可选 | 优秀 | 需分配 | 需要完整 Linux 环境或快照功能 |
| 直接安装 | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用设备 |

::: warning 重要提示
**不推荐在包含以下内容的 Windows 电脑上使用此安装方式**：

- **工作相关资料**：会计财务数据、商业机密、商用资料、客户信息、公司文档
- **个人隐私内容**：个人照片、文档、聊天记录、密码文件、浏览器历史记录
- **敏感开发项目**：私有代码仓库、API 密钥、配置文件、SSH 密钥
- **系统凭证**：Windows 凭据管理器中的密码、证书、域账户信息
- **任何你不希望暴露的数据**

**原因**：直接安装会将 OpenClaw 运行在 Windows 主系统上，如果 OpenClaw 或其依赖存在安全漏洞，可能影响系统上的所有数据，包括：
- 访问用户的文件系统
- 读取环境变量中的敏感信息
- 潜在访问 Windows 凭据管理器
- 影响其他正在运行的应用

**适用场景**：
- ✅ 专用于 OpenClaw 的独立 Windows 设备
- ✅ 临时测试环境（无敏感数据）
- ✅ 可随时重装系统的测试机
- ❌ 日常使用的个人电脑
- ❌ 包含任何工作或隐私数据的生产电脑
- ❌ 公司配发的办公电脑
- ❌ 加入域的企业环境

**强烈建议使用 [WSL2 安装方式](./windows-wsl2.md)** 或 **[VMware 虚拟机安装方式](./windows-vmware.md)** 以获得更好的隔离性和安全性。
:::

如果你不想使用虚拟化技术，可以直接在 Windows 上通过 PowerShell 安装 OpenClaw。这种方式最简单，但**缺乏隔离性，安全性最低**。

## 前置条件

- Windows 10/11
- PowerShell 5.1 或 PowerShell 7+
- 管理员权限（用于安装依赖）

## 步骤 1：安装 Node.js

### 方法 A：使用官方安装包（推荐）

1. 访问 [npmmirror Node 镜像](https://npmmirror.com/mirrors/node/)
2. 下载 **LTS 版本**（推荐 22.x 或 24.x）
3. 运行安装程序，按提示完成安装

### 方法 B：使用 winget

```powershell
winget install OpenJS.NodeJS.LTS
```

### 方法 C：使用 Chocolatey

```powershell
choco install nodejs-lts
```

验证安装：

```powershell
node --version
npm --version
```

设置 npm 国内镜像：

```powershell
npm config set registry https://registry.npmmirror.com
```

## 步骤 2：安装 龙虾

以**管理员身份**打开 PowerShell，运行：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

这个脚本会：
- 检查 Node.js 是否已安装
- 下载最新版本的 OpenClaw
- 安装到用户目录
- 配置 PATH 环境变量

## 步骤 3：刷新环境变量

安装完成后，关闭并重新打开 PowerShell，或者运行：

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
```

验证安装：

```powershell
openclaw --version
```

## 步骤 4：运行新手引导

```powershell
openclaw onboard
```

::: warning 注意
Windows 直接安装不支持 `--install-daemon` 参数。你需要手动启动 Gateway 或配置 Windows 服务。
:::

新手引导会配置：
- 认证（API Key、OAuth 等）
- Gateway 网关设置
- 可选的消息渠道

## 步骤 5：启动 Gateway

### 前台运行

```powershell
openclaw gateway --port 18789
```

这会在前台运行 Gateway，关闭窗口会停止服务。

### 后台运行

使用 Start-Process 在后台运行：

```powershell
Start-Process -FilePath "openclaw" -ArgumentList "gateway" -WindowStyle Hidden
```

### 配置为 Windows 服务（高级）

使用 NSSM（Non-Sucking Service Manager）：

1. 下载 [NSSM](https://nssm.cc/download)
2. 解压并添加到 PATH
3. 安装服务：

```powershell
nssm install OpenClawGateway
```

4. 在 GUI 中配置：
   - Path: `C:\Users\<用户名>\.local\bin\openclaw.cmd`
   - Arguments: `gateway`
   - Startup directory: `C:\Users\<用户名>`
5. 启动服务：

```powershell
nssm start OpenClawGateway
```

## 步骤 6：验证安装

```powershell
# 检查 Gateway 状态
openclaw status

# 打开 Control UI
openclaw dashboard
```

如果 Control UI 能加载（`http://127.0.0.1:18789/`），你的 Gateway 网关就已准备就绪。

## 常用命令

```powershell
# 诊断问题
openclaw doctor

# 查看 Gateway 状态
openclaw status

# 打开浏览器 UI
openclaw dashboard

# 重新配置
openclaw configure

# 查看 Gateway 日志
openclaw logs
```

## 常用环境变量

在 PowerShell 中设置：

```powershell
# 设置 龙虾 主目录
$env:OPENCLAW_HOME = "C:\Users\$env:USERNAME\.openclaw"

# 设置状态目录
$env:OPENCLAW_STATE_DIR = "C:\Users\$env:USERNAME\.openclaw\state"

# 设置配置文件路径
$env:OPENCLAW_CONFIG_PATH = "C:\Users\$env:USERNAME\.openclaw\openclaw.json"
```

永久设置（添加到系统环境变量）：

```powershell
[Environment]::SetEnvironmentVariable("OPENCLAW_HOME", "C:\Users\$env:USERNAME\.openclaw", "User")
```

## 文件位置

- 配置文件：`C:\Users\<用户名>\.openclaw\openclaw.json`
- 工作区：`C:\Users\<用户名>\.openclaw\workspace`
- 凭证：`C:\Users\<用户名>\.openclaw\credentials\`
- 日志：`C:\Users\<用户名>\AppData\Local\Temp\openclaw\`

## 常见问题

### 执行策略错误

如果遇到脚本执行策略错误：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 网络连接问题

检查防火墙是否阻止了 OpenClaw：

```powershell
# 临时关闭防火墙（测试用）
Set-NetFirewallProfile -Profile Private -Enabled False

# 允许 龙虾 通过防火墙
New-NetFirewallRule -DisplayName "OpenClaw Gateway" -Direction Inbound -LocalPort 18789 -Protocol TCP -Action Allow
```

### PATH 未更新

如果 `openclaw` 命令找不到：

先排查当前 Node/npm 与全局前缀位置：

```powershell
node -v
npm -v
npm prefix -g
echo $env:Path
```

如果 `npm prefix -g` 输出的目录不在你的 PATH 中，Windows 就找不到全局 npm 二进制文件（包括 `openclaw`）。

把 `npm prefix -g` 的输出加入 PATH：

```powershell
$npmPrefix = (npm prefix -g).Trim()

# 手动添加到 PATH（当前窗口）
$env:Path += ";$npmPrefix"

# 永久添加（当前用户）
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$npmPrefix", "User")
```

### SSL 证书问题

如果遇到 SSL 证书验证错误：

```powershell
# 临时禁用 SSL 验证（不推荐用于生产环境）
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
```

## 优缺点

### 优点

- 安装最简单
- 无需虚拟化
- 原生 Windows 环境
- 资源占用最低
