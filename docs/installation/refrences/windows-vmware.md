# Windows 安装方法 2：VMware 虚拟机（可选）

如果你不想使用 WSL2，或者需要更完整的 Linux 环境，可以使用 VMware 虚拟机安装 OpenClaw。这种方式提供了良好的隔离性和灵活性。

## 推荐等级说明

| 安装方式                        | 推荐等级     | 隔离性 | 资源占用 | 适用场景               |
| --------------------------- | -------- | --- | ---- | ------------------ |
| [WSL2](./windows-wsl2.md)   | ⭐⭐⭐⭐⭐ 推荐 | 良好  | 低    | 大多数用户的首选           |
| VMware 虚拟机                  | ⭐⭐⭐⭐ 可选  | 优秀  | 高    | 需要完整 Linux 环境或快照功能 |
| [直接安装](./windows-native.md) | ⭐⭐ 不推荐   | 无   | 最低   | 仅限无敏感数据的专用设备       |

VMware 虚拟机相比 WSL2 的优势：

- ✅ **完整的系统隔离**：独立的虚拟机环境
- ✅ **快照功能**：可随时回滚到任意状态
- ✅ **完整的 Linux 体验**：可运行任何 Linux 应用
- ❌ **资源占用较高**：需要分配更多内存和 CPU
- ❌ **管理复杂度**：需要单独维护虚拟机

## 前置条件

- Windows 10/11 64 位
- 启用虚拟化功能（BIOS/UEFI 中）
- 至少 8GB 内存（推荐 16GB）
- 至少 50GB 可用磁盘空间

## 步骤 1：下载并安装 VMware

推荐版本：

- `VMware Workstation Pro 25H2 for Windows - Free`
- 发布日期：`2025-10-15`
- 安装包文件名：`VMware-Workstation-Full-25H2u1-25219725.exe`
- 简体中文界面语言包（非官方汉化）：`VMware-Workstation-Full-25H2u1-25219725-CHS-Lang.zip`

下载链接（复制到迅雷打开）：

```text
安装包：https://pan.xunlei.com/s/VOnzrCb4zh2AsSWHLHEsm6jzA1?pwd=8kgw#
汉化包：https://pan.xunlei.com/s/VOnzqULYMTVnWQJqud6MvoftA1?pwd=zsgn#
```

安装包校验（确认原包未篡改，可去网上找签名对比）：

```powershell
Get-FileHash "文件路径\\VMware-Workstation-Full-25H2u1-25219725.exe" -Algorithm SHA256
```

预期 SHA256：

```text
b592c47756d47c932a3ce2c2b83ad3af1fa23ccc1dd1d3166a51bcc1d2bd58e0
```

安装流程：

1. 先安装 `VMware-Workstation-Full-25H2u1-25219725.exe`
2. 再解压并应用 `VMware-Workstation-Full-25H2u1-25219725-CHS-Lang.zip`
3. 启动 VMware，确认可以正常创建虚拟机

## 步骤 2：下载 Linux 镜像（直接可下）

### Ubuntu（桌面版，直接迅雷下载）

```text
https://old-releases.ubuntu.com/releases/plucky/ubuntu-25.04-desktop-amd64.iso
```

### Debian（体积更小，流行，适合轻量部署）

```text
https://chuangtzu.ftp.acc.umu.se/debian-cd/current/amd64/iso-cd/debian-13.3.0-amd64-netinst.iso
```

## 步骤 3：创建虚拟机

::: danger 关键：先做“单向沙箱”设置（建议在安装 Ubuntu 前完成）
在 VMware Tools 安装完成之前，你通常无法在 Windows 与 Ubuntu 之间复制/粘贴文本；但更重要的是，即使安装了 VMware Tools，**剪贴板共享 / 拖放 / 共享文件夹** 也会让“虚拟机反向接触主机”变得更容易。

如果你的目标是“主机是上帝，虚拟机只能在沙盒里干活”，建议先在 VMware 侧把这些能力关掉（这是 Windows/VMware 侧的设置，不依赖 Ubuntu 内部权限）：

1. 关机（Power Off）虚拟机
2. VMware 菜单 → 虚拟机设置 → 选项（Options）
3. `Guest Isolation`：取消勾选
   - `Enable copy and paste`
   - `Enable drag and drop`
4. `Shared Folders`：选择 `Disabled`

如果你希望“再保险”到配置层（即使误点 UI 也不生效），可以在虚拟机关机后编辑 `.vmx` 文件，加入：

```text
isolation.tools.copy.disable = "TRUE"
isolation.tools.paste.disable = "TRUE"
isolation.tools.dnd.disable = "TRUE"
isolation.tools.hgfs.disable = "TRUE"
```
:::

::: details）安装 Ubuntu 系统前 VMware 准备设置

!\[1-选择典型.png]\(./assets/windows安装Ubuntu/1. 安装Ubuntu系统前VMware准备设置/1-选择典型.png null)
!\[2-选择Ubuntu镜像文件.png]\(./assets/windows安装Ubuntu/1. 安装Ubuntu系统前VMware准备设置/2-选择Ubuntu镜像文件.png null)
!\[3-用户名和密码.png]\(./assets/windows安装Ubuntu/1. 安装Ubuntu系统前VMware准备设置/3-用户名和密码.png null)
!\[4-虚拟机命名.png]\(./assets/windows安装Ubuntu/1. 安装Ubuntu系统前VMware准备设置/4-虚拟机命名.png null)
!\[5-虚拟机文件系统设置.png]\(./assets/windows安装Ubuntu/1. 安装Ubuntu系统前VMware准备设置/5-虚拟机文件系统设置.png null)
!\[6-完成虚拟机设置.png]\(./assets/windows安装Ubuntu/1. 安装Ubuntu系统前VMware准备设置/6-完成虚拟机设置.png null)
:::

## 步骤 4：安装 Ubuntu图文引导

::: details 1）Ubuntu 系统安装步骤

!\[1-语言选中文.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/1-语言选中文.png null)
!\[2-可访问性.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/2-可访问性.png null)
!\[3-键盘选英语（美国）.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/3-键盘选英语（美国）.png null)
!\[4-网络连接.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/4-网络连接.png null)
!\[5-安装Ubuntu.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/5-安装Ubuntu.png null)
!\[6-选择交互式安装.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/6-选择交互式安装.png null)
!\[7-建议扩展集合，不差这点硬盘.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/7-建议扩展集合，不差这点硬盘.png null)
!\[8-显卡网卡驱动安装.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/8-显卡网卡驱动安装.png null)
!\[9-开始安装.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/9-开始安装.png null)
!\[10-不要加密硬盘.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/10-不要加密硬盘.png null)
!\[12-用户和密码.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/12-用户和密码.png null)
!\[13-时区设置.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/13-时区设置.png null)
!\[14-最后确认.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/14-最后确认.png null)
!\[15-重启.png]\(./assets/windows安装Ubuntu/2.Ubuntu系统安装的步骤/15-重启.png null)
:::

::: details 2）首次开机设置

!\[1-如果前面选文件加密要输入密码.png]\(./assets/windows安装Ubuntu/3.首次开机设置/1-如果前面选文件加密要输入密码.png null)
!\[2-用户选择.png]\(./assets/windows安装Ubuntu/3.首次开机设置/2-用户选择.png null)
!\[3-用户密码.png]\(./assets/windows安装Ubuntu/3.首次开机设置/3-用户密码.png null)
!\[4-首次开机设置.png]\(./assets/windows安装Ubuntu/3.首次开机设置/4-首次开机设置.png null)
!\[5-我不共享数据.png]\(./assets/windows安装Ubuntu/3.首次开机设置/5-我不共享数据.png null)
!\[6-完成.png]\(./assets/windows安装Ubuntu/3.首次开机设置/6-完成.png null)
!\[7-虚拟机设置.png]\(./assets/windows安装Ubuntu/3.首次开机设置/7-虚拟机设置.png null)
!\[8-顺手推出安装镜像.png]\(./assets/windows安装Ubuntu/3.首次开机设置/8-顺手推出安装镜像.png null)
!\[9-选择桥接模式.png]\(./assets/windows安装Ubuntu/3.首次开机设置/9-选择桥接模式.png null)
!\[10-联网测试.png]\(./assets/windows安装Ubuntu/3.首次开机设置/10-联网测试.png null)
:::

::: details 3）其他必要设置

!\[1-黑屏处理.png]\(./assets/windows安装Ubuntu/4.其他必要设置/1-黑屏处理.png null)
!\[2-切换为拼音.png]\(./assets/windows安装Ubuntu/4.其他必要设置/2-切换为拼音.png null)
!\[3-分辨率设置.png]\(./assets/windows安装Ubuntu/4.其他必要设置/3-分辨率设置.png null)
!\[4-分辨率合适就好.png]\(./assets/windows安装Ubuntu/4.其他必要设置/4-分辨率合适就好.png null)
!\[5-保留分辨率更改.png]\(./assets/windows安装Ubuntu/4.其他必要设置/5-保留分辨率更改.png null)
!\[6-终端.png]\(./assets/windows安装Ubuntu/4.其他必要设置/6-终端.png null)
:::

::: details 4）VMware 虚拟机日常操作

!\[1-开关机，重启.png]\(./assets/windows安装Ubuntu/VMware虚拟机使用/1-开关机，重启.png null)
!\[2. 快照-时光机.png]\(./assets/windows安装Ubuntu/VMware虚拟机使用/2. 快照-时光机.png null)
:::

## 步骤 4.5：发行版升级到最新可用版本（按需）

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

## 步骤 5：安装 VMware Tools（可选）

说明：安装 Ubuntu 系统阶段并没有 VMware Tools；VMware Tools 是系统装好后再安装的。

如果你需要更好的桌面体验（分辨率自适应、剪贴板、拖放等），可以安装 VMware Tools（Ubuntu 下对应 `open-vm-tools`）：

```bash
# 在 Ubuntu 中
sudo apt update
sudo apt install open-vm-tools open-vm-tools-desktop
sudo reboot
```

如果你追求更强隔离（单向沙箱），可以不安装 `open-vm-tools-desktop`，并保持上面 `Guest Isolation / Shared Folders` 处于禁用状态。

## 步骤 6：拍摄快照

安装完 VMware Tools 并重启后，立刻拍摄快照，名称固定为：`最初的模样`。

操作路径：

1. VMware 菜单 → 虚拟机 → 快照 → 拍摄快照
2. 名称填写：`最初的模样`
3. 说明可写：`刚装好系统和 VMware Tools 的干净状态`
4. 但是我们必须注意，后续多拍快照，特别是进行升级以后，因为升级是耗时的

## 步骤 7：安装 龙虾（直接复用 Ubuntu Native 指南）

在虚拟机里的 Ubuntu 中，OpenClaw 安装流程与 Ubuntu 本机完全一致，直接按这篇执行即可：

- [Linux 安装方法 2（APT）：直接安装](./linux-native-apt.md)

## 常见问题

### 注销后重启服务停止，打不开 OpenClaw

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

- [配置消息渠道（QQ / 飞书）](../talk-with-lobster.md)
- [了解快速设置](../quick-start.md)
- [私信安全和批准](https://docs.openclaw.ai/pairing)
