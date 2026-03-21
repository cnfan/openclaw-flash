# Windows 安装方法 1：WSL2（推荐）

这是官方推荐的 Windows 安装方式。通过 **WSL2**（Windows Subsystem for Linux 2），你可以在 Windows 上运行完整的 Linux 环境，获得最佳兼容性和性能。

## 推荐等级说明

| 安装方式 | 推荐等级 | 隔离性 | 资源占用 | 适用场景 |
|---------|---------|--------|---------|---------|
| WSL2 | ⭐⭐⭐⭐⭐ 推荐 | 良好 | 低 | **大多数用户的首选** |
| [VMware 虚拟机](./windows-vmware.md) | ⭐⭐⭐⭐ 可选 | 优秀 | 需分配 | 需要完整 Linux 环境或快照功能 |
| [直接安装](./windows-native.md) | ⭐⭐ 不推荐 | 无 | 最低 | 仅限无敏感数据的专用设备 |

<details>
<summary>WSL1 与 WSL2 的区别（目前官方默认支持 WSL2，不需要特别注意）</summary>

| 特性 | WSL1 | WSL2 |
|------|------|------|
| 架构 | 翻译层 | 真实 Linux 内核 |
| 文件系统性能 | 较慢 | 接近原生 |
| Docker 支持 | 不支持 | 完整支持 |
| systemd 支持 | 不支持 | 支持 |

**OpenClaw 需要 WSL2**，因为它依赖 systemd 来管理后台服务。
</details>

## 前置条件

- Windows 10 版本 2004+（内部版本 19041 及更高）或 Windows 11
- 启用虚拟化功能（BIOS/UEFI 中）
- 管理员权限

遇到任何安装失败，请直接看文末的 [失败指引](#failure-guide)。

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

重启后先确认 WSL 版本信息：

```powershell
wsl --version
wsl --status
```

判断“没问题”可以看这几点：

- `wsl --version`：能正常输出版本号（如 `WSL 版本: 2.x.x.x`），说明 WSL 组件已安装
- `wsl --status`：看到 `默认版本: 2`（或 `Default Version: 2`），说明新安装发行版会默认使用 WSL2
- `wsl --status`：看到内核版本信息（如 `内核版本: 5.15.x.x`），说明 WSL2 内核可用

## 步骤 2：安装 Ubuntu

重启计算机后，查看可用的发行版列表：

```powershell
wsl --list --online
```

推荐安装 **Ubuntu 24.04 LTS**：

```powershell
wsl --install -d Ubuntu-24.04
```

安装后立刻确认使用 WSL2

```powershell
wsl --list --verbose
```

输出应该显示 `VERSION` 为 `2`：

```text
  NAME            STATE           VERSION
* Ubuntu-24.04    Running         2
```

::: danger 关键：在第一次进入 Ubuntu 前先执行（真正的单向沙箱）
WSL 默认会把 Windows 的磁盘（如 `C:`）自动挂载到 Linux 的 `/mnt/` 下（如 `/mnt/c`）。

如果你的目标是“Windows 主机是上帝、WSL 只在沙盒里干活”，那就应该**禁用自动挂载**：让 Windows 可以访问 WSL（`\\wsl$\...`），但 WSL 默认无法访问 Windows 主机磁盘。

注意：这一条需要在 **Ubuntu 已安装** 后执行（因为配置文件写入的是 Ubuntu 内部的 `/etc/wsl.conf`）。

特别提醒：不要把它写到 `%UserProfile%\.wslconfig` 里。
`.wslconfig` 是 WSL2 虚拟机的全局配置文件（内存、CPU 等），但**不提供** `automount.enabled=false` 这种“全局禁用 Windows 盘自动挂载”的开关；自动挂载属于发行版内的 `wsl.conf`（`/etc/wsl.conf`）。

补充说明：WSL 的“自动挂载”是 **发行版内配置**（`/etc/wsl.conf`），不是 Windows 侧的全局开关；即使禁用了自动挂载，在 WSL 内拥有高权限的进程仍可能通过手动 `mount -t drvfs` 的方式尝试挂载 Windows 盘。因此这更像“默认隔离”，如果你追求更强的硬隔离，优先选 VMware 虚拟机。

以管理员身份打开 PowerShell，执行（如发行版名称不是 `Ubuntu-24.04`，先用 `wsl --list --verbose` 查看并替换）：

```powershell
wsl -d Ubuntu-24.04 --user root -- sh -lc @'
cat >/etc/wsl.conf <<"EOF"
[automount]
enabled=false
mountFsTab=false

[interop]
enabled=false
appendWindowsPath=false

[boot]
systemd=true
EOF
'@

wsl --shutdown
```

之后再进入 Ubuntu（`wsl -d Ubuntu-24.04`），检查 `/mnt/c` 应该不存在或为空。
:::

## 步骤 3：Ubuntu 初始设置

首次启动 Ubuntu 时，需要完成初始化设置：

1. 等待安装完成（首次启动需要解压文件系统，可能需要几分钟）
2. 创建用户账户：
   - 输入 UNIX 用户名（建议使用小写字母，不含空格）
   - 输入密码（输入时不会显示，这是正常的）
   - 再次确认密码

示例：

```text
Enter new UNIX username: myuser
New password:
Retype new password:
passwd: password updated successfully
Installation successful!
```

如需手动启动：

```powershell
wsl
wsl -d Ubuntu-24.04
```

## 步骤 3.5：发行版升级到最新可用版本（按需）

如果你的目标是“直接升级到 Ubuntu 官方提供的最新可升级版本”，建议在“刚装好 Ubuntu、还没开始装任何依赖”时就完成一次发行版升级。

注意：只有当 Ubuntu 官方开放升级通道时，这一步才会成功；否则会提示“没有可用的新版本”。不要为了强行升级使用 `-d`（开发版升级）去赌运气。

在 Ubuntu 里执行：

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt autoremove -y

sudo apt install -y update-manager-core
sudo do-release-upgrade
```

升级完成后，按提示重启（在 PowerShell 侧执行 `wsl --shutdown` 后再进入发行版也可以）。

## 步骤 3.6：配置加速源（建议在发行版升级之后再做）

配置加速源，因为默认是访问国外的网络，加速源是国内大厂做的中转，会快十倍甚至更多。

```bash
source /etc/os-release
echo "deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${VERSION_CODENAME} main restricted universe multiverse" | sudo tee /etc/apt/sources.list > /dev/null
echo "deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${VERSION_CODENAME}-updates main restricted universe multiverse" | sudo tee -a /etc/apt/sources.list > /dev/null
echo "deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${VERSION_CODENAME}-backports main restricted universe multiverse" | sudo tee -a /etc/apt/sources.list > /dev/null
echo "deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${VERSION_CODENAME}-security main restricted universe multiverse" | sudo tee -a /etc/apt/sources.list > /dev/null
npm config set registry https://registry.npmmirror.com
```

## 步骤 4：启用并验证 systemd

WSL2 支持 systemd，OpenClaw 的后台服务需要它。

先检查是否已启用：

```bash
systemctl --version
```

如果有版本输出，说明 systemd 已可用。

如果你在上面的“真正的单向沙箱”步骤里已经写入了 `/etc/wsl.conf`，通常可以直接跳过本步骤。

如果未启用，确保 `/etc/wsl.conf` 里包含：

```text
[boot]
systemd=true
```

如果你已经有 `/etc/wsl.conf`（例如前面配置了 `automount/interop`），不要用覆盖写法；用下面命令“追加缺失项”即可：

```bash
sudo sh -lc '
touch /etc/wsl.conf
grep -q "^\[boot\]" /etc/wsl.conf || printf "\n[boot]\n" >> /etc/wsl.conf
grep -q "^systemd=true" /etc/wsl.conf || printf "systemd=true\n" >> /etc/wsl.conf
'
```

保存后在 PowerShell 重启 WSL：

```powershell
wsl --shutdown
wsl
```

再次验证：

```bash
systemctl --version
```

## 步骤 5：安装 龙虾（两条路线：优先 Docker）

在 WSL 场景中，WSL 特有步骤（WSL2 安装、版本确认、systemd）完成后，后续有两条分支路线：

- **路线 A（优先）**：走 Docker 安装，按这篇继续执行：
  - [Linux 安装方法 1：Docker 安装（推荐）](./linux-docker.md)
- **路线 B（备选）**：走 Linux native 直接安装（APT），按这篇继续执行：
  - [Linux 安装方法 2（APT）：直接安装](./linux-native-apt.md)

如果你看到“需要查看 Linux native 安装 OpenClaw”的提示：这通常是因为当前处于 Linux 环境（WSL 的 Ubuntu）里；但从隔离性、可维护性角度，仍建议优先选 Docker 路线。

<a id="failure-guide"></a>

## 失败指引（折叠）

<details>
<summary>安装或运行失败时请展开</summary>

### 1. `wsl --install --no-distribution` 失败

二者关系：

- “启用或关闭 Windows 功能”里勾选“适用于 Linux 的 Windows 子系统”和“虚拟机平台”，是图形界面手动方式
- `wsl --install --no-distribution` 是命令行自动方式
- 两者目标一致，通常优先用命令，失败再用手动勾选兜底

处理顺序：

1. 确认在管理员 PowerShell 执行
2. 进入“启用或关闭 Windows 功能”，勾选：
   - 适用于 Linux 的 Windows 子系统
   - 虚拟机平台
3. 重启 Windows
4. 再次执行：

```powershell
wsl --install --no-distribution
```

5. 仍失败时，检查 BIOS/UEFI 是否启用虚拟化（Intel VT-x / AMD-V）

### 2. `wsl --version` 或 `wsl --status` 输出异常

- 没有版本号或提示命令不可用：通常是组件未安装完成，先回到第 1 条重做启用
- `默认版本` 不是 `2`：执行 `wsl --set-default-version 2`
- 缺少内核版本信息：执行 `wsl --update` 后再试 `wsl --status`

```powershell
wsl --set-default-version 2
wsl --update
wsl --status
```

### 3. 发行版显示为 WSL1

```powershell
wsl --set-version Ubuntu-24.04 2
wsl --set-default-version 2
```

### 4. WSL2 无法启动

```powershell
wsl --shutdown
wsl
```

若仍失败：

```powershell
systeminfo | findstr /i "虚拟化"
```

### 5. 网络访问问题

```bash
ip addr show eth0
```

Windows 侧访问优先使用：`http://localhost:18789`

### 6. 文件访问与性能

- 从 Windows 访问 WSL2 文件：`\\wsl$\Ubuntu-24.04\home\<用户名>`
- 从 WSL2 访问 Windows 文件：`/mnt/c/Users/<用户名>/`
- 不要在 `/mnt/c/` 下运行 Node.js 项目，建议在 `~/` 下工作

### 7. 内存占用过高

可以配置 `C:\Users\<用户名>\.wslconfig`：

```ini
[wsl2]
memory=4GB
```

### 8. 重新安装 Ubuntu

```powershell
wsl --unregister Ubuntu-24.04
wsl --install -d Ubuntu-24.04
```

</details>
